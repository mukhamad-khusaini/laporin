<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Pest\Laravel\json;
use function PHPSTORM_META\map;

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
        $request->validate([
            'nama_usaha' => 'required|string|max:255',
            'jenis_usaha' => 'required|in:jasa,dagang,manufaktur',
            'akun_default' => 'nullable|array', // jika kamu kirim array akun
        ]);

        $company = Company::create([
            'user_id' => Auth::user()->id,
            'name' => $request->nama_usaha,
            'company_type' => $request->jenis_usaha,
        ]);

        // Simpan akun default
        if ($request->filled('akun_default')) {
            foreach ($request->akun_default as $akun) {
                $company->accounts()->create([
                    'name' => $akun['name'],
                    'account_code' => $akun['code'],
                    'account_type_id' => $akun['type_id'],
                    'company_id' => $company->id,
                    'is_active' => true,
                ]);
            }
        }

        return redirect('/dashboard');
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
