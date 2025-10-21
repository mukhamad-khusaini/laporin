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

    public static function getPembelianKreditJson()
    {
        $headers = TransactionHeader::with([
            'details.account',
            'details.subLedger'
        ])
        ->where('transaction_category', 'pembelian.kredit')
        ->orderBy('transaction_date', 'desc')
        ->get()
        ->map(function ($header) {
            $akunGabungan = $header->details->map(function ($detail) {
                return [
                    'account' => $detail->account->name ?? '-',
                    'debit' => floatval($detail->debit),
                    'credit' => floatval($detail->credit),
                    'sub_ledger' => $detail->subLedger->name ?? null,
                ];
            });
    
            return [
                'transaction_date' => $header->transaction_date->format('Y-m-d'),
                'description' => $header->description,
                'details' => $akunGabungan,
            ];
        });
    
        return response()->json([
            'data' => $headers,
        ]);
    }


    public function transaction(): BelongsTo
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
