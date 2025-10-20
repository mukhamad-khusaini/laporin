<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\TransactionDetail;
use Inertia\Inertia;

class ContentController extends Controller
{
    public function dashboardShow()
    {
        return Inertia::render('Dashboard');
    }

    public function pembelianKreditShow()
    {
        $data = TransactionDetail::getPembelianKreditJson();
        return Inertia::render('content/PembelianKredit',['data'=> $data]);
    }

    public function pembelianTunaiShow()
    {
        return Inertia::render('content/PembelianTunai');
    }
    
    public function penjualanKreditShow()
    {
        return Inertia::render('content/PenjualanKredit');
    }

    public function penjualanTunaiShow()
    {
        return Inertia::render('content/PenjualanTunai');
    }
    
    public function produksiShow()
    {
        return Inertia::render('content/Produksi');
    }
    
    public function modalShow()
    {
        return Inertia::render('content/Modal');
    }
    
    public function utangShow()
    {
        return Inertia::render('content/Utang');
    }
    
    public function priveShow()
    {
        return Inertia::render('content/Prive');
    }
    
    public function piutangShow()
    {
        return Inertia::render('content/Piutang');
    }
    
    public function bebanShow()
    {
        return Inertia::render('content/Beban');
    }
    
    public function akunShow()
    {
        return Inertia::render('content/Akun', ['data'=>Account::all()]);
    }
    
    public function penyesuaianShow()
    {
        return Inertia::render('content/Penyesuaian');
    }
    
    public function vendorShow()
    {
        return Inertia::render('content/Vendor');
    }
    
    public function laporinShow()
    {
        return Inertia::render('content/Laporin');
    }
}
