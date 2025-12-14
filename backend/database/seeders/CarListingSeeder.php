<?php

namespace Database\Seeders;

use App\Models\CarListing;
use App\Models\User;
use Database\Seeders\Helpers\ImageCache;
use Illuminate\Database\Seeder;

class CarListingSeeder extends Seeder
{
    protected array $carData = [
        'BMW' => [
            ['model' => 'M3 Competition', 'price_range' => [55000, 85000]],
            ['model' => 'M5', 'price_range' => [70000, 120000]],
            ['model' => 'X5 xDrive40i', 'price_range' => [60000, 90000]],
            ['model' => '330i', 'price_range' => [35000, 55000]],
            ['model' => '530d', 'price_range' => [40000, 65000]],
        ],
        'Mercedes' => [
            ['model' => 'C 300', 'price_range' => [38000, 55000]],
            ['model' => 'E 350', 'price_range' => [45000, 70000]],
            ['model' => 'AMG GT', 'price_range' => [100000, 180000]],
            ['model' => 'GLC 300', 'price_range' => [42000, 65000]],
            ['model' => 'S 500', 'price_range' => [90000, 150000]],
        ],
        'Audi' => [
            ['model' => 'A4 45 TFSI', 'price_range' => [35000, 50000]],
            ['model' => 'A6 50 TDI', 'price_range' => [50000, 75000]],
            ['model' => 'RS6 Avant', 'price_range' => [110000, 160000]],
            ['model' => 'Q5 45 TFSI', 'price_range' => [45000, 65000]],
            ['model' => 'TT RS', 'price_range' => [55000, 80000]],
        ],
        'Porsche' => [
            ['model' => '911 Carrera', 'price_range' => [100000, 180000]],
            ['model' => 'Cayenne', 'price_range' => [70000, 120000]],
            ['model' => 'Macan S', 'price_range' => [55000, 85000]],
            ['model' => 'Panamera', 'price_range' => [85000, 150000]],
        ],
        'Volkswagen' => [
            ['model' => 'Golf GTI', 'price_range' => [28000, 45000]],
            ['model' => 'Passat Variant', 'price_range' => [30000, 50000]],
            ['model' => 'Tiguan R-Line', 'price_range' => [35000, 55000]],
            ['model' => 'Arteon', 'price_range' => [40000, 60000]],
        ],
    ];

    protected array $locations = [
        'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne',
        'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Hannover',
    ];

    public function run(): void
    {
        $sellers = User::where('user_type', 'seller')->get();

        if ($sellers->isEmpty()) {
            return;
        }

        foreach (range(1, 20) as $i) {
            $make = array_rand($this->carData);
            $carInfo = fake()->randomElement($this->carData[$make]);
            $year = fake()->numberBetween(2018, 2024);
            $mileage = fake()->numberBetween(5000, 120000);

            $listing = CarListing::create([
                'user_id' => $sellers->random()->id,
                'make' => $make,
                'model' => $carInfo['model'],
                'year' => $year,
                'mileage' => $mileage,
                'price' => fake()->numberBetween($carInfo['price_range'][0], $carInfo['price_range'][1]),
                'fuel_type' => fake()->randomElement(['petrol', 'diesel', 'hybrid', 'electric']),
                'transmission' => fake()->randomElement(['automatic', 'manual']),
                'location' => fake()->randomElement($this->locations),
                'description' => $this->generateDescription($make, $carInfo['model'], $year, $mileage),
                'is_featured' => fake()->boolean(30),
                'status' => 'active',
                'created_at' => fake()->dateTimeBetween('-60 days', 'now'),
            ]);

            // Add 2-5 photos per listing
            $this->attachPhotos($listing, fake()->numberBetween(2, 5));
        }
    }

    protected function generateDescription(string $make, string $model, int $year, int $mileage): string
    {
        $conditions = ['excellent', 'very good', 'well-maintained', 'pristine', 'perfect'];
        $condition = fake()->randomElement($conditions);

        return "Beautiful {$year} {$make} {$model} in {$condition} condition. "
            . "Only " . number_format($mileage) . " km driven. "
            . "Full service history, all maintenance up to date. "
            . fake()->randomElement([
                'Non-smoker vehicle.',
                'Garage kept.',
                'One owner from new.',
                'Recently serviced.',
                'New tires fitted.',
            ]) . " "
            . fake()->randomElement([
                'Contact for more details and test drive.',
                'Serious buyers only please.',
                'Price negotiable for quick sale.',
                'All original documents available.',
            ]);
    }

    protected function attachPhotos(CarListing $listing, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            try {
                $imagePath = ImageCache::getCarImage();
                $listing->addMedia($imagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('photos');
            } catch (\Exception $e) {
                // Skip if image download fails
            }
        }
    }
}
