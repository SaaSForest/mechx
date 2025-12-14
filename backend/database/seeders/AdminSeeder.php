<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user if not exists
        User::firstOrCreate(
            ['email' => 'admin@mechx.app'],
            [
                'full_name' => 'Admin User',
                'email' => 'admin@mechx.app',
                'password' => Hash::make('admin123'),
                'phone' => '+355 69 000 0000',
                'user_type' => 'seller',
                'business_name' => 'MechX Admin',
                'business_address' => 'Tirana, Albania',
                'specialty' => 'Platform Administration',
                'is_verified' => true,
                'is_admin' => true,
                'rating' => 5.0,
                'sales_count' => 0,
            ]
        );

        $this->command->info('Admin user created: admin@mechx.app / admin123');
    }
}
