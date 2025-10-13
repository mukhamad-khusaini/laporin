<?php

use App\Http\Controllers\EventsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [EventsController::class, "show"]);
Route::get('/pembelian/kredit', fn () => Inertia::render('Pembelian'))->name('pembelian.kredit');
Route::get('/pembelian/tunai', fn () => Inertia::render('Pembelian'))->name('pembelian.tunai');
Route::get('/penjualan', fn () => Inertia::render('Penjualan'))->name('penjualan');
Route::get('/produksi', fn () => Inertia::render('Produksi'))->name('produksi');