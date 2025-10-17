<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("CreateCompany");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd($request);
        // $akunDasar = [
        //     ['name' => 'Kas', 'code' => '101', 'type_id' => 1],
        //     ['name' => 'Utang', 'code' => '201', 'type_id' => 2],
        //     ['name' => 'Modal', 'code' => '301', 'type_id' => 3],
        //     ['name' => 'Beban', 'code' => '401', 'type_id' => 4],
        //     ['name' => 'Peralatan', 'code' => '102', 'type_id' => 1],
        //     ['name' => 'Perlengkapan', 'code' => '103', 'type_id' => 1],
        // ];
        
        // $akunTambahan = [
        //     'jasa' => [
        //         ['name' => 'Pendapatan', 'code' => '501', 'type_id' => 5],
        //     ],
        //     'dagang' => [
        //         ['name' => 'Penjualan', 'code' => '502', 'type_id' => 5],
        //     ],
        //     'manufaktur' => [
        //         ['name' => 'Penjualan', 'code' => '502', 'type_id' => 5],
        //         ['name' => 'Bahan Baku', 'code' => '104', 'type_id' => 1],
        //     ],
        // ];

        // $request->validate([
        //     'nama_usaha' => 'required|string|max:255',
        //     'jenis_usaha' => 'required|in:jasa,dagang,manufaktur',
        //     'akun_default' => 'nullable|array', // jika kamu kirim array akun
        // ]);

        // $company = Company::create([
        //     'user_id' => Auth::id(),
        //     'name' => $request->nama_usaha,
        //     'company_type' => $request->jenis_usaha,
        // ]);

        // // Simpan akun default
        // $jenisUsaha = $request->jenis_usaha;
        // $akunTerpilih = array_merge($akunDasar, $akunTambahan[$jenisUsaha] ?? []);
        

        // if ($request->filled('akun_default')) {
        //     foreach ($akunTerpilih as $akun) {
        //         $company->accounts()->create([
        //             'name' => $akun['name'],
        //             'account_code' => $akun['code'],
        //             'account_type_id' => $akun['type_id'],
        //             'is_active' => true,
        //         ]);
        //     }
        // }

        // return redirect('/pivot');
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        //
    }
}
