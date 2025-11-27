<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create default categories for the test user
        $user = \App\Models\User::first();

        $defaultCategories = [
            ['name' => 'Gaji', 'type' => 'income', 'color' => '#10B981', 'icon' => '💰'],
            ['name' => 'Freelance', 'type' => 'income', 'color' => '#10B981', 'icon' => '💼'],
            ['name' => 'Investasi', 'type' => 'income', 'color' => '#10B981', 'icon' => '📈'],
            ['name' => 'Makanan', 'type' => 'expense', 'color' => '#EF4444', 'icon' => '🍔'],
            ['name' => 'Transportasi', 'type' => 'expense', 'color' => '#F59E0B', 'icon' => '🚗'],
            ['name' => 'Hiburan', 'type' => 'expense', 'color' => '#8B5CF6', 'icon' => '🎬'],
            ['name' => 'Belanja', 'type' => 'expense', 'color' => '#EC4899', 'icon' => '🛍️'],
            ['name' => 'Kesehatan', 'type' => 'expense', 'color' => '#06B6D4', 'icon' => '🏥'],
            ['name' => 'Pendidikan', 'type' => 'expense', 'color' => '#84CC16', 'icon' => '📚'],
            ['name' => 'Transfer', 'type' => 'transfer', 'color' => '#6B7280', 'icon' => '🔄'],
        ];

        foreach ($defaultCategories as $category) {
            \App\Models\Category::create(array_merge($category, ['user_id' => $user->id, 'is_default' => true]));
        }
    }
}
