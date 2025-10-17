<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Middleware\EnsureUserHasCompany;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get("/dashboard", function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', EnsureUserHasCompany::class])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/pembelian', function () { 
    return Inertia::render('content/Pembelian');
})->name('pembelian');

Route::get('/akun', function () { 
    return Inertia::render('content/Akun');
})->name('akun');

Route::get('/pivot', function(){
    return Inertia::render('Pivot');
});

Route::resource('company', CompanyController::class);

require __DIR__.'/auth.php';
