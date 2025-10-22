<?php

namespace App\Http\Controllers;

use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembelianKreditController extends Controller
{
    public function index()
    {
        $data = TransactionDetail::getPembelianKredit();
        return Inertia::render('content/PembelianKredit',['data'=> $data]);
    }

    public function show(){
        //
    }

    public function store(Request $request)
    {
        dd($request);
    }

    public function update(Request $request)
    {
        dd($request);
    }

    public function destroy($id)
    {
        dd($id);
    }
}
