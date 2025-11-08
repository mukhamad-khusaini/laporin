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

class PembelianKreditController extends Controller
{
    private function toTitleCase($string)
    {
        return ucwords(strtolower($string));
    }

    public function index()
    {
        $data = TransactionDetail::getPembelianKredit();

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

        // Ambil akun vendor
        $utangAccount = Account::where('name', 'Utang')->first();

        // Ambil subledger barang
        $subLedgers = SubLedger::whereIn('account_id', $barangAccounts)
            ->pluck('name')
            ->unique()
            ->values();

        // Ambil subledger vendor
        $vendors = $utangAccount
            ? SubLedger::where('account_id', $utangAccount->id)
                ->pluck('name')
                ->unique()
                ->values()
            : collect();

        return Inertia::render('content/PembelianKredit', [
            'data' => $data,
            'sub_ledgers' => $subLedgers,
            'vendors' => $vendors,
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
            'quantity' => 'required|numeric',
            'vendor' => 'required|string',
            'description' => 'string',
            'transaction_date' => 'required|date_format:Y-m-d\TH:i',
        ]);


        DB::beginTransaction();

        try {
            // Ambil akun
            $debitAccount = Account::where('name', $validated['account'])->firstOrFail();
            $creditAccount = Account::where('name', 'Utang')->firstOrFail();

            // Cari atau buat barang
            $barangName = $this->toTitleCase($validated['sub_ledger']);
            $barang = SubLedger::firstOrCreate([
                'name' => $barangName,
                'account_id' => $debitAccount->id,
            ]);

            // Cari atau buat vendor
            $vendorName = $this->toTitleCase($validated['vendor']);
            $vendor = SubLedger::firstOrCreate([
                'name' => $vendorName,
                'account_id' => $creditAccount->id,
            ]);

            // Simpan header transaksi
            $header = TransactionHeader::create([
                'company_id' => Auth::user()->company->id,
                'user_id' => Auth::user()->id,
                'transaction_date' => $validated['transaction_date'],
                'description' => $validated['description'],
                'transaction_category' => 'pembelian.kredit',
            ]);

            // Simpan detail debit
            TransactionDetail::create([
                'transaction_header_id' => $header->id,
                'account_id' => $debitAccount->id,
                'sub_ledger_id' => $barang->id,
                'debit' => $validated['amount'],
                'quantity' => $validated['quantity'],
            ]);

            // Simpan detail kredit
            TransactionDetail::create([
                'transaction_header_id' => $header->id,
                'account_id' => $creditAccount->id,
                'sub_ledger_id' => $vendor->id,
                'credit' => $validated['amount'],
            ]);

            DB::commit();

            return redirect()->route('pembelian-kredit.index')->with('success', 'Transaksi berhasil disimpan.');
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
            'quantity' => 'required|numeric',
            'vendor' => 'nullable|string',
            'transaction_date' => 'nullable|date_format:Y-m-d\TH:i',
            'description' => 'nullable|string',
        ]);
    
        DB::beginTransaction();
    
        try {
            $header = TransactionHeader::findOrFail($id);
            $debitDetail = $header->details()->where('debit', '>', 0)->first();
            $creditDetail = $header->details()->where('credit', '>', 0)->first();
            $totalAmount = $validated['amount']*$validated['quantity'];
    
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
            if (!empty($validated['quantity'])) {
                $debitDetail->quantity = $validated['quantity'];
            }
            $debitDetail->save();
    
            // Update kredit detail
            if (!empty($validated['vendor'])) {
                $creditAccount = Account::where('name', 'Utang')->firstOrFail();
                $vendorName = $this->toTitleCase($validated['vendor']);
                $vendor = SubLedger::firstOrCreate([
                    'name' => $vendorName,
                    'account_id' => $creditAccount->id,
                ]);
                $creditDetail->sub_ledger_id = $vendor->id;
            }
            if (!empty($validated['amount'])) {
                $creditDetail->credit = $validated['amount'];
                $creditDetail->debit = 0;
            }
            $creditDetail->save();
    
            DB::commit();
    
            return redirect()->route('pembelian-kredit.index')
                ->with('success', 'Transaksi berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('pembelian-kredit.index')
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
    
            return redirect()->route('pembelian-kredit.index')
                ->with('success', 'Transaksi berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('pembelian-kredit.index')
                ->with('error', 'Gagal menghapus transaksi: ' . $e->getMessage());
        }
    
    }
}
