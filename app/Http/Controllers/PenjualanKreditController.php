<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\SubLedger;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
