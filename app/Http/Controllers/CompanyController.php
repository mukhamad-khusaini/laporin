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
            'nama_usaha' => [
                'required',
                'string',
                'regex:/^[a-zA-Z0-9_ ]+$/'
            ],
            'jenis_usaha' => 'required|in:jasa,dagang,manufaktur',
            'akun_default' => 'array',
        ]);

        // Store and return company
        Company::createWithAccounts($request->all(), Auth::id());

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
