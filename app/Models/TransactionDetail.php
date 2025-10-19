<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $fillable = ['transaction_header_id', 'account_id', 'debit', 'credit'];

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
