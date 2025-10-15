<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionDetail>
 */
class TransactionDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transaction_header_id' => \App\Models\TransactionHeader::factory(),
            'account_id' => \App\Models\Account::factory(),
            'debit' => $this->faker->randomFloat(2, 0, 100000),
            'credit' => 0, // atau sebaliknya, tergantung skenario
        ];
    }
}
