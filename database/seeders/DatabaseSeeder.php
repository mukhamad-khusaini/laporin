<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Company;
use App\Models\AccountType;
use App\Models\Account;
use App\Models\TransactionHeader;
use App\Models\TransactionDetail;
use App\Models\SubLedger;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. User
        $user = User::create([
            'name' => 'Mukhamad',
            'email' => 'mukhamad@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // 2. Company
        $company = Company::create([
            'user_id' => $user->id,
            'company_type' => 'manufaktur',
            'name' => 'Laporin Manufaktur',
        ]);

        // 3. Account Types
        $types = [
            ['id' => 1, 'name' => 'Asset','normal_balance' => 'debit'],
            ['id' => 2, 'name' => 'Utang','normal_balance' => 'credit'],
            ['id' => 3, 'name' => 'Modal','normal_balance' => 'credit'],
            ['id' => 4, 'name' => 'Beban','normal_balance' => 'debit'],
            ['id' => 5, 'name' => 'Omset','normal_balance' => 'credit'],
        ];

        $typeIds = [];
        foreach ($types as $type) {
            $typeIds[$type['name']] = AccountType::create([
                'id' => $type['id'],
                'name' => $type['name'],
                'normal_balance' => $type['normal_balance'],
            ])->id;
        }

        $akunDasar = [
            [
                'name' => "Kas",
                'code'=> 101,
                'type_id'=> 1,
            ],
            [
                'name' => "Utang",
                'code'=> 201,
                'type_id'=> 2,
            ],
            [
                'name' => "Modal",
                'code'=> 301,
                'type_id'=> 3,
            ],
            [
                'name' => "Beban",
                'code'=> 401,
                'type_id'=> 4,
            ],
            [
                'name' => "Peralatan",
                'code'=> 102,
                'type_id'=> 1,
            ],
            [
                'name' => "Perlengkapan",
                'code'=> 103,
                'type_id'=> 1,
            ],
            [
                'name' => "Penjualan",
                'code'=> 501,
                'type_id'=> 5,
            ],
            [
                'name' => "Bahan Baku",
                'code'=> 104,
                'type_id'=> 1,
            ],
            [
                'name' => "Piutang",
                'code'=> 105,
                'type_id'=> 1,
            ],
        ];

        // 4. Accounts
        $accountIds = [];
        foreach ($akunDasar as $akun) {
            $accountIds[$akun['name']] = Account::create([
                'company_id' => $company->id,
                'account_type_id' => $akun['type_id'],
                'name' => $akun['name'],
                'account_code' => $akun['code'],
                'is_active' => true,
            ])->id;
        }

        // 5. SubLedgers
        $subledgerMap = [
            'Utang' => ['Bank Mandiri', 'Koperasi Syariah'],
            'Piutang' => ['Toko Sumber Rejeki', 'CV Maju Jaya'],
            'Peralatan' => ['Mesin Potong', 'Mesin Jahit'],
            'Perlengkapan' => ['Alat Tulis', 'Seragam'],
            'Bahan Baku' => ['Kain Katun', 'Benang']
        ];

        $subledgerIds = [];
        foreach ($subledgerMap as $account => $items) {
            foreach ($items as $item) {
                $sub = SubLedger::create([
                    'account_id' => $accountIds[$account],
                    'name' => $item,
                ]);
                $subledgerIds[$account][] = $sub->id;
            }
        }

        // 6. Transaction Headers & Details
        $categories = [
            'pembelian.tunai', 'pembelian.kredit', 'penjualan.tunai', 'penjualan.kredit',
            'produksi', 'modal', 'utang', 'prive', 'piutang', 'beban', 'penyesuaian'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $category = $categories[array_rand($categories)];
            $header = TransactionHeader::create([
                'company_id' => $company->id,
                'user_id' => $user->id,
                'transaction_category' => $category,
                'description' => "Transaksi ke-$i ($category)",
                'transaction_date' => Carbon::now()->subDays(100 - $i),
            ]);

            // Ambil 2 akun acak
            $akunDebit = array_rand($accountIds);
            $akunKredit = array_rand(array_diff_key($accountIds, [$akunDebit => true]));

            $amount = rand(100000, 500000);

            TransactionDetail::create([
                'transaction_header_id' => $header->id,
                'account_id' => $accountIds[$akunDebit],
                'debit' => $amount,
                'credit' => 0,
                'sub_ledger_id' => $subledgerIds[$akunDebit][array_rand($subledgerIds[$akunDebit] ?? [null])] ?? null,
            ]);

            TransactionDetail::create([
                'transaction_header_id' => $header->id,
                'account_id' => $accountIds[$akunKredit],
                'debit' => 0,
                'credit' => $amount,
                'sub_ledger_id' => $subledgerIds[$akunKredit][array_rand($subledgerIds[$akunKredit] ?? [null])] ?? null,
            ]);
        }
    }
}
