<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\SubLedger;
use App\Models\TransactionDetail;
use App\Models\TransactionHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PembelianTunaiController extends Controller
{
    private function toTitleCase($string)
    {
        return ucwords(strtolower($string));
    }

    public function index()
    {
        $data = TransactionDetail::getPembelianTunai();

        // Ambil tipe perusahaan (bisa dari user, config, atau model)
        $companyType = Auth::user()->company->company_type ?? 'jasa'; // default jasa

        // Tentukan akun default
        $defaultAccounts = match ($companyType) {
            'manufaktur' => ['Peralatan', 'Perlengkapan', 'Bahan Baku'],
            'dagang'     => ['Peralatan', 'Perlengkapan', 'Persediaan Barang'],
            default      => ['Peralatan', 'Perlengkapan'],
        };

        // Ambil akun dari transaksi
        $transaksiAccounts = collect($data)->pluck('account_type')->filter()->unique()->values();

        // Gabungkan dan hilangkan duplikat
        $akunOptions = collect($defaultAccounts)
            ->merge($transaksiAccounts)
            ->unique()
            ->values();


        // Ambil akun barang
        $barangAccounts = Account::whereIn('name', [
            'Peralatan', 'Perlengkapan', 'Bahan Baku', 'Persediaan'
        ])->pluck('id');

        // Ambil akun sumber
        $kasAccount = Account::where('name', 'Kas')->first();

        // Ambil subledger barang
        $subLedgers = SubLedger::whereIn('account_id', $barangAccounts)
            ->pluck('name')
            ->unique()
            ->values();

        // Ambil sub ledger nya kas
        $kasSubLedgers = collect();

        if ($kasAccount) {
            SubLedger::firstOrCreate([
                'name' => 'Kas',
                'account_id' => $kasAccount->id,
            ]);
            $kasSubLedgers = SubLedger::where('account_id', $kasAccount->id)
                ->pluck('name')
                ->unique()
                ->values();
        }


        return Inertia::render('content/PembelianTunai', [
            'data' => $data,
            'sub_ledgers' => $subLedgers,
            'source' => $kasSubLedgers,
            'account_options' => $akunOptions,
        ]);
    }

    public function show(){
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account' => 'required|string',
            'sub_ledger' => 'required|string',
            'amount' => 'required|numeric',
            'source' => 'required|string',
            'description' => 'string',
            'transaction_date' => 'required|date_format:Y-m-d\TH:i',
        ]);


        DB::beginTransaction();

        try {
            // Ambil akun
            $debitAccount = Account::where('name', $validated['account'])->firstOrFail();
            $creditAccount = Account::where('name', 'Kas')->firstOrFail();

            // Cari atau buat barang
            $barangName = $this->toTitleCase($validated['sub_ledger']);
            $barang = SubLedger::firstOrCreate([
                'name' => $barangName,
                'account_id' => $debitAccount->id,
            ]);

            // Cari atau buat source
            $sourceName = $this->toTitleCase($validated['source']);
            $source = SubLedger::firstOrCreate([
                'name' => $sourceName,
                'account_id' => $creditAccount->id,
            ]);

            // Simpan header transaksi
            $header = TransactionHeader::create([
                'company_id' => Auth::user()->company->id,
                'user_id' => Auth::user()->id,
                'transaction_date' => $validated['transaction_date'],
                'description' => $validated['description'],
                'transaction_category' => 'pembelian.tunai',
            ]);

            // Simpan detail debit
            TransactionDetail::create([
                'transaction_header_id' => $header->id,
                'account_id' => $debitAccount->id,
                'sub_ledger_id' => $barang->id,
                'debit' => $validated['amount'],
            ]);

            // Simpan detail kredit
            TransactionDetail::create([
                'transaction_header_id' => $header->id,
                'account_id' => $creditAccount->id,
                'sub_ledger_id' => $source->id,
                'credit' => $validated['amount'],
            ]);

            DB::commit();

            return redirect()->route('pembelian-tunai.index')->with('success', 'Transaksi berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menambah transaksi: ' . $e->getMessage());

        }

    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'account' => 'nullable|string',
            'sub_ledger' => 'nullable|string',
            'amount' => 'nullable|numeric',
            'source' => 'nullable|string',
            'transaction_date' => 'nullable|date_format:Y-m-d\TH:i',
            'description' => 'nullable|string',
        ]);
    
        DB::beginTransaction();
    
        try {
            $header = TransactionHeader::findOrFail($id);
            $debitDetail = $header->details()->where('debit', '>', 0)->first();
            $creditDetail = $header->details()->where('credit', '>', 0)->first();
    
            // Update header
            $headerUpdate = [];
            if (!empty($validated['transaction_date'])) {
                $headerUpdate['transaction_date'] = $validated['transaction_date'];
            }
            if (!empty($validated['description'])) {
                $headerUpdate['description'] = $validated['description'];
            }
            if ($headerUpdate) {
                $header->update($headerUpdate);
            }
    
            // Update debit detail
            if (!empty($validated['account'])) {
                $debitAccount = Account::where('name', $validated['account'])->firstOrFail();
                $debitDetail->account_id = $debitAccount->id;
            }
            if (!empty($validated['sub_ledger'])) {
                $barangName = $this->toTitleCase($validated['sub_ledger']);
                $barang = SubLedger::firstOrCreate([
                    'name' => $barangName,
                    'account_id' => $debitDetail->account_id ?? $debitAccount->id ?? null,
                ]);
                $debitDetail->sub_ledger_id = $barang->id;
            }
            if (!empty($validated['amount'])) {
                $debitDetail->debit = $validated['amount'];
                $debitDetail->credit = 0;
            }
            $debitDetail->save();
    
            // Update kredit detail
            if (!empty($validated['source'])) {
                $creditAccount = Account::where('name', 'Kas')->firstOrFail();
                $sourceName = $this->toTitleCase($validated['source']);
                $source = SubLedger::firstOrCreate([
                    'name' => $sourceName,
                    'account_id' => $creditAccount->id,
                ]);
                $creditDetail->sub_ledger_id = $source->id;
            }
            if (!empty($validated['amount'])) {
                $creditDetail->credit = $validated['amount'];
                $creditDetail->debit = 0;
            }
            $creditDetail->save();
    
            DB::commit();
    
            return redirect()->route('pembelian-tunai.index')
                ->with('success', 'Transaksi berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('pembelian-tunai.index')
                ->with('error', 'Gagal memperbarui transaksi: ' . $e->getMessage());
        }        
    }

    public function destroy($id)
    {
        try {
            $transaksi = TransactionHeader::findOrFail($id);
    
            // Hapus detail melalui relasi jika tidak pakai cascade
            $transaksi->details()->delete();
    
            // Hapus header
            $transaksi->delete();
    
            return redirect()->route('pembelian-tunai.index')
                ->with('success', 'Transaksi berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('pembelian-tunai.index')
                ->with('error', 'Gagal menghapus transaksi: ' . $e->getMessage());
        }
    
    }
}
