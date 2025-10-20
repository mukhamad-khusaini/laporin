<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubLedger extends Model
{
    use HasFactory;
    protected $fillable = ['account_id', 'name'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
