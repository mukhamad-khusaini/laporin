<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\TransactionHeader;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $fillable = ['transaction_header_id', 'account_id', 'debit', 'credit'];

    public static function getPembelianKredit()
    {
        return Self::with([
            'account',
            'subLedger',
            'transactionHeader.details.subLedger', // preload semua detail untuk akses vendor
        ])
        ->whereHas('transactionHeader', function ($q) {
            $q->where('transaction_category', 'pembelian.kredit');
        })
        ->where('debit', '>', 0) // hanya ambil akun pembelian
        ->orderByDesc('transaction_header_id')
        ->get()
        ->map(function ($detail) {
            // Cari detail lain dalam transaksi yang sama yang posisinya kredit
            $vendorDetail = $detail->transactionHeader->details
                ->where('credit', '>', 0)
                ->first();

            return [
                'transaction_date' => $detail->transactionHeader->transaction_date->format('Y-m-d'),
                'sub_ledger' => $detail->subLedger->name ?? '-',
                'total' => floatval($detail->debit),
                'vendor' => $vendorDetail?->subLedger?->name ?? '-',
                'account_type' => $detail->account->name ?? '-',
            ];
        });
    }



    public function transactionHeader(): BelongsTo
    {
        return $this->belongsTo(TransactionHeader::class, 'transaction_header_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function subLedger()
    {
        return $this->belongsTo(SubLedger::class);
    }
}
