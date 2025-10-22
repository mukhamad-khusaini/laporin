<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\PembelianKreditController;
use App\Http\Controllers\TransactionController;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// This app router
Route::middleware(['auth'])->group(function(){
    // Dashboard
    Route::get("/dashboard", [ContentController::class,'dashboardShow'])->name('dashboard');

    // Pembelian
    Route::get('/pembelian-tunai', [ContentController::class,'pembelianTunaiShow'])->name('pembelian.tunai');
    Route::resource('pembelian-kredit', PembelianKreditController::class);

    // Penjualan
    Route::get('/penjualan-tunai', [ContentController::class,'penjualanTunaiShow'])->name('penjualan.tunai');
    Route::get('/penjualan-kredit', [ContentController::class,'penjualanKreditShow'])->name('penjualan.kredit');

    // Produksi
    Route::get('/produksi', [ContentController::class,'produksiShow'])->name('produksi');

    // Transaksi Kas
    Route::get('/modal', [ContentController::class,'modalShow'])->name('modal');
    Route::get('/utang', [ContentController::class,'utangShow'])->name('utang');
    Route::get('/piutang', [ContentController::class,'piutangShow'])->name('piutang');
    Route::get('/beban', [ContentController::class,'bebanShow'])->name('beban');
    Route::get('/prive', [ContentController::class,'priveShow'])->name('prive');

    // Akun
    Route::get('/akun', [ContentController::class,'akunShow'])->name('akun');

    // Penyesuaian
    Route::get('/penyesuaian', [ContentController::class,'penyesuaianShow'])->name('penyesuaian');
    
    // Vendor
    Route::get('/vendor', [ContentController::class,'vendorShow'])->name('vendor');

    // LAPORIN
    Route::get('/laporin', [ContentController::class,'laporinShow'])->name('laporin');
});


Route::resource('company', CompanyController::class);


require __DIR__.'/auth.php';
