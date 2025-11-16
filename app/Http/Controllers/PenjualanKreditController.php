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
            'receivable' => 'required|string',
            'description' => 'string',
            'transaction_date' => 'required|date_format:Y-m-d\TH:i',
        ]);

        DB::beginTransaction();


        try {
            $hargaJual = $validated["amount"];
            $akunPenjualan = Account::where('name', $validated["account_type"])->firstOrFail();
            $akunPiutang = Account::where('name', 'Piutang')->firstOrFail();
            $subLedgerPenjualan = SubLedger::where('name', $validated["sub_ledger"])->where('account_id', $akunPenjualan->id)->first();
            $subLedgerPiutang = SubLedger::where('name', $validated["receivable"])->where('account_id', $akunPiutang->id)->first();


            // Buat header transaksi
            $header = TransactionHeader::create([
                'company_id'          => Auth::user()->company->id,
                'user_id'             => Auth::user()->id,
                'transaction_date'    => $validated["transaction_date"],
                'transaction_category'=> 'penjualan.kredit',
                'description'         => $validated["description"],
            ]);

            // Logika pencatatan
            // Logika produk
            if ($validated["account_type"] === 'Produk') {
                // $subLedgerPenjualan = SubLedger::where('name', $validated["sub_ledger"])->where('account_id', $akunPenjualan->id)->first();
                // $hpp = $subLedgerPenjualan->nilai_buku ?? 0;

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
            

            // PERLU MENAMBAHKAN COMPANY ID PADA QUERY

            // Logika peralatan dan perlengkapan
            else if ($validated["account_type"] === 'Peralatan' || $validated["account_type"] === 'Perlengkapan') {
                $subLedgerPenjualan = SubLedger::where('name', $validated["sub_ledger"])->where('account_id', $akunPenjualan->id)->first();
                $nilaiBuku = TransactionDetail::whereHas('subLedger', function ($q) {
                    $q->where('name', $subLedgerPenjualan->name);
                })->get(['quantity', 'debit', 'credit']);

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
