<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use App\Models\AccountType;
use App\Models\Account;
use App\Models\TransactionHeader;
use App\Models\TransactionDetail;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

         // Buat 1 company untuk user tersebut
         $company = Company::factory()->create([
            'user_id' => $user->id,
            'name' => 'PT Laporin Sejahtera',
        ]);

        // Buat 4 jenis akun dasar
        $types = collect([
            ['name' => 'Aktiva', 'normal_balance' => 'debit'],
            ['name' => 'Kewajiban', 'normal_balance' => 'credit'],
            ['name' => 'Ekuitas', 'normal_balance' => 'credit'],
            ['name' => 'Pendapatan', 'normal_balance' => 'credit'],
        ])->map(fn ($type) => AccountType::create($type));

        // Buat 5 akun
        $accounts = Account::factory()->count(5)->create([
            'company_id' => $company->id,
            'account_type_id' => $types->random()->id,
        ]);

        // Buat 3 transaksi
        TransactionHeader::factory()->count(3)->create([
            'company_id' => $company->id,
            'user_id' => $user->id,
        ])->each(function ($header) use ($accounts) {
            TransactionDetail::factory()->create([
                'transaction_header_id' => $header->id,
                'account_id' => $accounts->random()->id,
                'debit' => 100000,
                'credit' => 0,
            ]);

            TransactionDetail::factory()->create([
                'transaction_header_id' => $header->id,
                'account_id' => $accounts->random()->id,
                'debit' => 0,
                'credit' => 100000,
            ]);
        });
    }
}
