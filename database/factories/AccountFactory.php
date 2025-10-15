<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => \App\Models\Company::factory(),
            'account_type_id' => \App\Models\AccountType::factory(),
            'name' => $this->faker->word(),
            'account_code' => $this->faker->unique()->numerify('###'),
            'is_active' => true,
            'parent_account_id' => null, // bisa diisi manual nanti
        ];
    }
}
