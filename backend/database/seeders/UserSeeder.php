<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Helpers\ImageCache;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Demo accounts for easy testing
        $demoAccounts = [
            [
                'full_name' => 'Max Müller',
                'email' => 'demo@mechx.app',
                'password' => Hash::make('password123'),
                'phone' => '+49 170 1234567',
                'user_type' => 'buyer',
                'is_verified' => true,
                'rating' => 4.8,
            ],
            [
                'full_name' => 'AutoParts Pro Berlin',
                'email' => 'seller@mechx.app',
                'password' => Hash::make('password123'),
                'phone' => '+49 30 12345678',
                'user_type' => 'seller',
                'business_name' => 'AutoParts Pro GmbH',
                'business_address' => 'Berliner Str. 123, 10115 Berlin',
                'specialty' => 'BMW, Mercedes, Audi',
                'is_verified' => true,
                'rating' => 4.9,
                'sales_count' => 156,
            ],
        ];

        foreach ($demoAccounts as $account) {
            $user = User::create($account);
            $this->attachProfilePhoto($user);
        }

        // Buyers
        $buyers = [
            ['full_name' => 'Thomas Schmidt', 'email' => 'thomas.schmidt@example.de', 'phone' => '+49 151 12345678'],
            ['full_name' => 'Julia Weber', 'email' => 'julia.weber@example.de', 'phone' => '+49 152 23456789'],
            ['full_name' => 'Michael Becker', 'email' => 'michael.becker@example.de', 'phone' => '+49 157 34567890'],
            ['full_name' => 'Sarah Fischer', 'email' => 'sarah.fischer@example.de', 'phone' => '+49 160 45678901'],
            ['full_name' => 'Daniel Hoffmann', 'email' => 'daniel.hoffmann@example.de', 'phone' => '+49 162 56789012'],
            ['full_name' => 'Anna Schulz', 'email' => 'anna.schulz@example.de', 'phone' => '+49 163 67890123'],
            ['full_name' => 'Lukas Wagner', 'email' => 'lukas.wagner@example.de', 'phone' => '+49 170 78901234'],
            ['full_name' => 'Laura Meyer', 'email' => 'laura.meyer@example.de', 'phone' => '+49 171 89012345'],
            ['full_name' => 'Felix Koch', 'email' => 'felix.koch@example.de', 'phone' => '+49 172 90123456'],
            ['full_name' => 'Emma Richter', 'email' => 'emma.richter@example.de', 'phone' => '+49 173 01234567'],
        ];

        foreach ($buyers as $buyer) {
            $user = User::create([
                ...$buyer,
                'password' => Hash::make('password123'),
                'user_type' => 'buyer',
                'is_verified' => fake()->boolean(80),
                'rating' => fake()->randomFloat(1, 3.5, 5.0),
            ]);
            $this->attachProfilePhoto($user);
        }

        // Sellers
        $sellers = [
            [
                'full_name' => 'German Car Parts',
                'email' => 'info@germancarparts.de',
                'phone' => '+49 89 9876543',
                'business_name' => 'German Car Parts GmbH',
                'business_address' => 'Maximilianstr. 45, 80539 München',
                'specialty' => 'Porsche, Volkswagen, Audi',
            ],
            [
                'full_name' => 'Euro Auto Spares',
                'email' => 'contact@euroautospares.de',
                'phone' => '+49 40 1122334',
                'business_name' => 'Euro Auto Spares Hamburg',
                'business_address' => 'Hafenstr. 78, 20457 Hamburg',
                'specialty' => 'All German brands',
            ],
            [
                'full_name' => 'Premium Parts Frankfurt',
                'email' => 'sales@premiumparts.de',
                'phone' => '+49 69 5544332',
                'business_name' => 'Premium Parts Deutschland',
                'business_address' => 'Mainzer Landstr. 200, 60327 Frankfurt',
                'specialty' => 'Mercedes-Benz specialist',
            ],
            [
                'full_name' => 'BavariaParts München',
                'email' => 'info@bavariaparts.de',
                'phone' => '+49 89 7766554',
                'business_name' => 'BavariaParts GmbH',
                'business_address' => 'Leopoldstr. 88, 80802 München',
                'specialty' => 'BMW, Mini',
            ],
            [
                'full_name' => 'Stuttgart Auto Components',
                'email' => 'hello@stuttgartauto.de',
                'phone' => '+49 711 2233445',
                'business_name' => 'Stuttgart Auto Components',
                'business_address' => 'Königstr. 120, 70173 Stuttgart',
                'specialty' => 'Porsche, Mercedes',
            ],
            [
                'full_name' => 'Rhein Parts Köln',
                'email' => 'service@rheinparts.de',
                'phone' => '+49 221 9988776',
                'business_name' => 'Rhein Parts GmbH',
                'business_address' => 'Hohe Str. 55, 50667 Köln',
                'specialty' => 'Ford, Opel, VW',
            ],
            [
                'full_name' => 'Nord Auto Teile',
                'email' => 'kontakt@nordautoteile.de',
                'phone' => '+49 40 6655443',
                'business_name' => 'Nord Auto Teile Hamburg',
                'business_address' => 'Mönckebergstr. 32, 20095 Hamburg',
                'specialty' => 'Volvo, Saab, European imports',
            ],
            [
                'full_name' => 'Düsseldorf Kfz-Teile',
                'email' => 'info@dusseldorf-kfz.de',
                'phone' => '+49 211 4433221',
                'business_name' => 'Düsseldorf Kfz-Teile',
                'business_address' => 'Königsallee 15, 40212 Düsseldorf',
                'specialty' => 'All brands, new and used',
            ],
        ];

        foreach ($sellers as $seller) {
            $user = User::create([
                ...$seller,
                'password' => Hash::make('password123'),
                'user_type' => 'seller',
                'is_verified' => true,
                'rating' => fake()->randomFloat(1, 4.0, 5.0),
                'sales_count' => fake()->numberBetween(20, 500),
            ]);
            $this->attachProfilePhoto($user);
        }
    }

    protected function attachProfilePhoto(User $user): void
    {
        try {
            $imagePath = ImageCache::getPersonImage();
            $user->addMedia($imagePath)
                ->preservingOriginal()
                ->toMediaCollection('profile_photo');
        } catch (\Exception $e) {
            // Skip if image download fails
        }
    }
}
