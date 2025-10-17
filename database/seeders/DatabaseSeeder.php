<?php

namespace Database\Seeders;

// use App\Models\User;
// use App\Models\Company;
// use App\Models\AccountType;
// use App\Models\Account;
// use App\Models\TransactionHeader;
// use App\Models\TransactionDetail;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('account_types')->insert([
            ['id' => 1, 'name' => 'Asset','normal_balance' => 'debit'],
            ['id' => 2, 'name' => 'Utang','normal_balance' => 'credit'],
            ['id' => 3, 'name' => 'Modal','normal_balance' => 'credit'],
            ['id' => 4, 'name' => 'Beban','normal_balance' => 'debit'],
            ['id' => 5, 'name' => 'Omset','normal_balance' => 'credit'],
        ]);
    }
}
