<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Middleware\EnsureUserHasCompany;
use App\Models\Account;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get("/dashboard", function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', EnsureUserHasCompany::class])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/pembelian-tunai', function () { 
    return Inertia::render('content/PembelianTunai');
})->name('pembelian.tunai');

Route::get('/pembelian-kredit', function () { 
    return Inertia::render('content/PembelianKredit');
})->name('pembelian.kredit');

Route::get('/akun', function () { 
    return Inertia::render('content/Akun',['data'=>Account::all()]);
})->name('akun');

Route::resource('company', CompanyController::class)->middleware(['auth']);

require __DIR__.'/auth.php';
