<?php

namespace Database\Seeders;

use App\Models\PartRequest;
use App\Models\User;
use Database\Seeders\Helpers\ImageCache;
use Illuminate\Database\Seeder;

class PartRequestSeeder extends Seeder
{
    protected array $carData = [
        'BMW' => ['M3', 'M5', 'X5', '3 Series', '5 Series', '7 Series', 'X3', 'X6'],
        'Mercedes' => ['C-Class', 'E-Class', 'S-Class', 'AMG GT', 'GLC', 'GLE', 'A-Class'],
        'Audi' => ['A4', 'A6', 'A8', 'RS6', 'Q5', 'Q7', 'TT', 'R8'],
        'Porsche' => ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster'],
        'Volkswagen' => ['Golf', 'Passat', 'Tiguan', 'Polo', 'Arteon', 'Touareg'],
        'Opel' => ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Grandland'],
        'Ford' => ['Focus', 'Fiesta', 'Kuga', 'Mustang', 'Mondeo'],
    ];

    protected array $parts = [
        'Brakes' => ['Front Brake Pads', 'Rear Brake Pads', 'Brake Rotors', 'Brake Calipers', 'Brake Lines'],
        'Engine' => ['Turbocharger', 'Timing Belt Kit', 'Water Pump', 'Alternator', 'Starter Motor', 'Engine Mount'],
        'Electrical' => ['ECU', 'Ignition Coil', 'Spark Plugs', 'Battery', 'Headlight Assembly', 'Tail Light'],
        'Body' => ['Side Mirror', 'Front Bumper', 'Rear Bumper', 'Fender', 'Hood', 'Grille'],
        'Suspension' => ['Shock Absorbers', 'Struts', 'Control Arms', 'Ball Joints', 'Tie Rod Ends'],
        'Transmission' => ['Clutch Kit', 'Flywheel', 'Transmission Mount', 'CV Joint', 'Driveshaft'],
        'Cooling' => ['Radiator', 'Cooling Fan', 'Thermostat', 'Coolant Reservoir', 'Heater Core'],
    ];

    protected array $engines = ['2.0L Turbo', '3.0L V6', '4.0L V8', '2.5L Diesel', '3.0L Diesel', '1.8L TSI', '2.0 TDI'];

    protected array $locations = ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Belfast', 'Derry', 'Kilkenny', 'Sligo', 'Athlone'];

    public function run(): void
    {
        $buyers = User::where('user_type', 'buyer')->get();

        if ($buyers->isEmpty()) {
            return;
        }

        foreach (range(1, 50) as $i) {
            $make = array_rand($this->carData);
            $model = fake()->randomElement($this->carData[$make]);
            $category = array_rand($this->parts);
            $partName = fake()->randomElement($this->parts[$category]);

            // Generate budget range (70% chance of having a budget)
            $hasBudget = fake()->boolean(70);
            $budgetMin = $hasBudget ? fake()->numberBetween(50, 500) : null;
            $budgetMax = $hasBudget ? fake()->numberBetween($budgetMin ?? 100, 2000) : null;

            $request = PartRequest::create([
                'user_id' => $buyers->random()->id,
                'car_make' => $make,
                'car_model' => $model,
                'car_year' => fake()->numberBetween(2015, 2024),
                'engine' => fake()->optional(0.7)->randomElement($this->engines),
                'part_name' => $partName,
                'description' => $this->generateDescription($partName, $make, $model),
                'condition_preference' => fake()->randomElement(['new', 'used', 'any']),
                'offer_deadline' => fake()->optional(0.5)->dateTimeBetween('+1 day', '+2 weeks'),
                'budget_min' => $budgetMin,
                'budget_max' => $budgetMax,
                'location' => fake()->randomElement($this->locations),
                'urgency' => fake()->randomElement(['flexible', 'standard', 'standard', 'urgent']),
                'status' => fake()->randomElement(['active', 'active', 'active', 'pending', 'completed']),
                'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
            ]);

            // Add 1-3 photos to some requests
            if (fake()->boolean(60)) {
                $this->attachPhotos($request, fake()->numberBetween(1, 3));
            }
        }
    }

    protected function generateDescription(string $part, string $make, string $model): string
    {
        $descriptions = [
            "Looking for a {$part} for my {$make} {$model}. Must be in good condition.",
            "Need {$part} urgently for {$make} {$model}. Original parts preferred.",
            "Searching for quality {$part} compatible with {$make} {$model}. Please include photos.",
            "My {$make} {$model} needs a new {$part}. OEM or quality aftermarket accepted.",
            "Looking for {$part} for {$make} {$model}. Prefer OEM but open to quality alternatives.",
            "Need replacement {$part} for my {$make} {$model}. Good condition required.",
        ];

        return fake()->randomElement($descriptions);
    }

    protected function attachPhotos(PartRequest $request, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            try {
                $imagePath = ImageCache::getPartImage();
                $request->addMedia($imagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('photos');
            } catch (\Exception $e) {
                // Skip if image download fails
            }
        }
    }
}
