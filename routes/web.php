<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Models\Account;
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
    Route::get("/dashboard", function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    Route::get('/pembelian-tunai', function () { 
        return Inertia::render('content/PembelianTunai');
    })->name('pembelian.tunai');
    Route::get('/pembelian-kredit', function () { 
        return Inertia::render('content/PembelianKredit');
    })->name('pembelian.kredit');
    Route::get('/akun', function () { 
        return Inertia::render('content/Akun',['data'=>Account::all()]);
    })->name('akun');
});

Route::resource('company', CompanyController::class);


require __DIR__.'/auth.php';
