<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = ['user_id','name','company_type'];


    public static function createWithAccounts(array $data, int $userId): Company
    {
        $company = self::create([
            'user_id' => $userId,
            'name' => $data['nama_usaha'],
            'company_type' => $data['jenis_usaha'],
        ]);

        foreach ($data['akun_default'] as $akun) {
            $company->accounts()->create([
                'name' => $akun['name'],
                'account_code' => $akun['code'],
                'account_type_id' => $akun['type_id'],
                'company_id' => $company->id,
                'is_active' => true,
            ]);
        }

        return $company;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(TransactionHeader::class);
    }
}
