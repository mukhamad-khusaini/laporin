<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\SubLedger;
use App\Models\TransactionDetail;
use App\Models\TransactionHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenjualanKreditController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = TransactionDetail::getPenjualanKredit();

         // Ambil akun-akun penjualan: Peralatan, Perlengkapan, Produk
        $akunPenjualan = Account::whereIn('name', ['Peralatan', 'Perlengkapan', 'Produk'])
        ->pluck('name')
        ->values();

        // Ambil sub ledger berdasarkan akun penjualan
        $subLedgerByAkun = [];

        foreach ($akunPenjualan as $akun) {
            $subLedgers = SubLedger::where('account_id', Account::where('name', $akun)->pluck('id')->values())
                ->pluck('name')
                ->unique()
                ->values();
    
            $subLedgerByAkun[$akun] = $subLedgers;
        }

        // Ambil akun-akun piutang (bisa berdasarkan nama atau kategori)
        $akunPiutang = Account::where('name', 'Piutang')->get();


        // Ambil semua sub ledger dari akun-akun piutang
        $subLedgerPiutang = SubLedger::where('account_id', $akunPiutang->pluck('id'))
        ->pluck('name')
        ->unique()
        ->values();

    

        return Inertia::render('content/PenjualanKredit', ['data'=>$data, 'account_options'=>$akunPenjualan, 'sub_ledgers'=> collect($subLedgerByAkun)->flatten(1)->values()->all(),'receivables'=>$subLedgerPiutang]);
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
            'receivable' => 'required|string',
            'description' => 'string',
            'transaction_date' => 'required|date_format:Y-m-d\TH:i',
        ]);

        DB::beginTransaction();

        try {
            $hargaJual = $request->amount;
            $akunPenjualan = Account::where('name', $request->account_type)->firstOrFail();
            $subLedgerPenjualan = SubLedger::where('name', $request->sub_ledger)->where('account_id', $akunPenjualan->id)->first();
            $akunPiutang = Account::where('name', 'Piutang')->firstOrFail();
            $subLedgerPiutang = SubLedger::where('name', $request->receivable)->where('account_id', $akunPiutang->id)->first();

            // Buat header transaksi
            $header = TransactionHeader::create([
                'transaction_date'    => $request->transaction_date,
                'transaction_category'=> 'penjualan.kredit',
                'description'         => $request->description,
            ]);

            // Logika pencatatan
            if ($request->account_type === 'Produk') {
                $hpp = $subLedgerPenjualan->nilai_buku ?? 0;

                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunPiutang->id,
                    'sub_ledger_id'         => $subLedgerPiutang->id,
                    'debit'                 => $hargaJual,
                ]);

                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunPenjualan->id,
                    'sub_ledger_id'         => $subLedgerPenjualan->id,
                    'credit'                => $hargaJual,
                ]);

                $akunHPP = Account::where('name', 'HPP')->firstOrFail();
                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunHPP->id,
                    'debit'                 => $hpp,
                ]);

                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunPenjualan->id,
                    'sub_ledger_id'         => $subLedgerPenjualan->id,
                    'credit'                => $hpp,
                ]);
            }

            else if ($request->account_type === 'Peralatan' || $request->account_type === 'Perlengkapan') {
                $nilaiBuku = $subLedgerPenjualan->nilai_buku ?? 0;

                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunPiutang->id,
                    'sub_ledger_id'         => $subLedgerPiutang->id,
                    'debit'                 => $hargaJual,
                ]);

                if ($hargaJual < $nilaiBuku) {
                    $akunBeban = Account::where('name', 'Beban Penjualan')->firstOrFail();
                    TransactionDetail::create([
                        'transaction_header_id' => $header->id,
                        'account_id'            => $akunBeban->id,
                        'debit'                 => $nilaiBuku - $hargaJual,
                    ]);
                } elseif ($hargaJual > $nilaiBuku) {
                    $akunPendapatanLain = Account::where('name', 'Pendapatan Lain')->firstOrFail();
                    TransactionDetail::create([
                        'transaction_header_id' => $header->id,
                        'account_id'            => $akunPendapatanLain->id,
                        'credit'                => $hargaJual - $nilaiBuku,
                    ]);
                }

                TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'account_id'            => $akunPenjualan->id,
                    'sub_ledger_id'         => $subLedgerPenjualan->id,
                    'credit'                => $nilaiBuku,
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
