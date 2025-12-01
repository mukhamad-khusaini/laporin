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
use phpDocumentor\Reflection\Types\Integer;

class PenjualanKreditController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = TransactionDetail::getPenjualanKredit();

        // Akun default yang pasti ada
        $akunPenjualan = Account::whereIn('name', ['Peralatan', 'Perlengkapan', 'Produk'])->get();
        $akunPiutang = Account::where('name', 'Piutang')->first();

        // Sub ledger per akun penjualan
        $subLedgerByAkun = [];

        foreach ($akunPenjualan as $akun) {
            $subLedgers = SubLedger::where('account_id', $akun->id)
                ->pluck('name')
                ->unique()
                ->values();

            $subLedgerByAkun[$akun->name] = $subLedgers;
        }

        // Sub ledger piutang
        $subLedgerPiutang = $akunPiutang
            ? SubLedger::where('account_id', $akunPiutang->id)->pluck('name')->unique()->values()
            : collect();

        return Inertia::render('content/PenjualanKredit', [
            'data' => $data,
            'account_options' => $akunPenjualan->pluck('name'),
            'sub_ledgers' => collect($subLedgerByAkun)->flatten(1)->values()->all(),
            'receivables' => $subLedgerPiutang,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_type' => 'required|string',
            'sub_ledger' => 'required|string',
            'amount' => 'required|numeric',
            'quantity' => 'required|numeric',
            'receivable' => 'required|string',
            'description' => 'string',
            'transaction_date' => 'required|date_format:Y-m-d\TH:i',
        ]);

        DB::beginTransaction();


        try {
            // Definisikan seluruh variabel yang dibutuhkan
            // 
            $hargaJual = $validated["amount"]*$validated['quantity'];
            $akunPenjualan = Account::where('name', $validated["account_type"])->firstOrFail();
            $akunPiutang = Account::where('name', 'Piutang')->firstOrFail();
            $subLedgerPenjualan = SubLedger::where('name', $validated["sub_ledger"])->where('account_id', $akunPenjualan->id)->first();
            $subLedgerPiutang = SubLedger::firstOrCreate(['name' => $validated["receivable"]],[
                'account_id'=>$akunPiutang->id
            ]);
            

            // Buat header transaksi
            // 
            $header = TransactionHeader::create([
                'company_id'          => Auth::user()->company->id,
                'user_id'             => Auth::user()->id,
                'transaction_date'    => $validated["transaction_date"],
                'transaction_category'=> 'penjualan.kredit',
                'description'         => $validated["description"],
            ]);

            // Logika pencatatan
            // 
            // 1. Logika produk
            if ($validated["account_type"] === 'Produk') {
                $subLedgerPenjualan = SubLedger::where('name', $validated["sub_ledger"])->where('account_id', $akunPenjualan->id)->first();
                $hpp = $subLedgerPenjualan->nilai_buku ?? 0;

                // TransactionDetail::create([
                //     'transaction_header_id' => $header->id,
                //     'account_id'            => $akunPiutang->id,
                //     'sub_ledger_id'         => $subLedgerPiutang->id,
                //     'debit'                 => $hargaJual,
                // ]);

                // TransactionDetail::create([
                //     'transaction_header_id' => $header->id,
                //     'account_id'            => $akunPenjualan->id,
                //     'sub_ledger_id'         => $subLedgerPenjualan->id,
                //     'credit'                => $hargaJual,
                // ]);

                // $akunHPP = Account::where('name', 'HPP')->firstOrFail();
                // TransactionDetail::create([
                //     'transaction_header_id' => $header->id,
                //     'account_id'            => $akunHPP->id,
                //     'debit'                 => $hpp,
                // ]);

                // TransactionDetail::create([
                //     'transaction_header_id' => $header->id,
                //     'account_id'            => $akunPenjualan->id,
                //     'sub_ledger_id'         => $subLedgerPenjualan->id,
                //     'credit'                => $hpp,
                // ]);
            }
            

            // 2. Logika peralatan dan perlengkapan
            else if ($validated["account_type"] === 'Peralatan' || $validated["account_type"] === 'Perlengkapan') {
                $allRelevantTransaction = TransactionDetail::whereHas('subLedger', function ($q) use ($subLedgerPenjualan) {
                    $q->where('name', $subLedgerPenjualan->name);
                })->get(['quantity', 'debit', 'credit']);

                // dd(array_map(function ($item) {return $item['debit'];}, $allRelevantTransaction->toArray()));
                // 
                // Hitung total nilai buku dan jumlah barang
                // 
                $allQuantity=array_sum(array_map(function ($i) {return intval($i['quantity']);}, $allRelevantTransaction->toArray()));
                $allAmount=array_sum(array_map(function ($i) {return intval($i['quantity'])*intval($i['debit']);},$allRelevantTransaction->toArray()));
                $averageItemValue=$allAmount/$allQuantity;

                // Masukan transaksi piutang ke debit
                // 
                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunPiutang->id,
                    'sub_ledger_id'         => $subLedgerPiutang->id,
                    'debit'                 => $hargaJual,
                ]);

    
                // BUAT LOGIKA UNTUK MENENTUKAN APAKAH HARGA JUAL LEBIH RENDAH ATAU TINGGI DARI NILAI BUKU
                // 
                // CARI CARA AGAR ACCOUNT TYPE ADA MODELNYA 
                if ($hargaJual < $averageItemValue*$validated['quantity']) {
                    $akunBeban = Account::firstOrCreate(['name' => 'Beban Penyusutan'],[
                        "company_id"=>Auth::user()->company->id,
                        "account_type_id"=>'',
                        "name"=>'',
                        "account_code"=>'',
                        "is_active"=>True,
                    ]);
                    TransactionDetail::create([
                        'transaction_header_id' => $header->id,
                        'account_id'            => $akunBeban->id,
                        'debit'                 => $allRelevantTransaction->$hargaJual,
                    ]);
                } elseif ($hargaJual > $allRelevantTransaction) {
                    $akunPendapatanLain = Account::where('name', 'Pendapatan Lain')->firstOrFail();
                    TransactionDetail::create([
                        'transaction_header_id' => $header->id,
                        'account_id'            => $akunPendapatanLain->id,
                        'credit'                => $hargaJual,
                    ]);
                }

                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunPenjualan->id,
                    'sub_ledger_id'         => $subLedgerPenjualan->id,
                    'credit'                => $allRelevantTransaction,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Transaksi penjualan kredit berhasil disimpan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('penjualan-kredit.index')
                ->with('error', 'Gagal memperbarui transaksi: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dd();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        dd($id);
    }
}
