<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\PartRequest;
use App\Models\User;
use Database\Seeders\Helpers\ImageCache;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    protected array $deliveryTimes = [
        '1-2 business days',
        '2-3 business days',
        '3-5 business days',
        '1 week',
        'Same day (pickup)',
        'Next day delivery',
    ];

    public function run(): void
    {
        $sellers = User::where('user_type', 'seller')->get();
        $activeRequests = PartRequest::where('status', 'active')->get();

        if ($sellers->isEmpty() || $activeRequests->isEmpty()) {
            return;
        }

        $offerCount = 0;
        $targetOffers = 100;

        foreach ($activeRequests as $request) {
            // Each request gets 1-4 offers
            $numOffers = fake()->numberBetween(1, 4);

            $usedSellers = [];

            for ($i = 0; $i < $numOffers && $offerCount < $targetOffers; $i++) {
                // Pick a seller that hasn't offered on this request yet
                $availableSellers = $sellers->whereNotIn('id', $usedSellers);

                if ($availableSellers->isEmpty()) {
                    break;
                }

                $seller = $availableSellers->random();
                $usedSellers[] = $seller->id;

                $basePrice = fake()->numberBetween(50, 2000);

                $offer = Offer::create([
                    'part_request_id' => $request->id,
                    'seller_id' => $seller->id,
                    'price' => $basePrice,
                    'part_condition' => fake()->randomElement(['new', 'used', 'refurbished']),
                    'delivery_time' => fake()->randomElement($this->deliveryTimes),
                    'notes' => $this->generateNotes($request->part_name),
                    'status' => fake()->randomElement(['pending', 'pending', 'pending', 'accepted', 'rejected']),
                    'created_at' => fake()->dateTimeBetween($request->created_at, 'now'),
                ]);

                // Add photos to some offers
                if (fake()->boolean(40)) {
                    $this->attachPhotos($offer, fake()->numberBetween(1, 2));
                }

                $offerCount++;
            }
        }
    }

    protected function generateNotes(string $partName): ?string
    {
        if (fake()->boolean(30)) {
            return null;
        }

        $notes = [
            "Original {$partName} in stock. Comes with 12-month warranty.",
            "High-quality aftermarket part. Tested and certified.",
            "OEM part from original manufacturer. Ships from our warehouse.",
            "Used part in excellent condition. 6-month guarantee.",
            "Brand new, sealed in original packaging.",
            "Genuine part with all certificates. Free shipping included.",
            "Premium quality replacement. Installation guide available.",
            "Direct fit, no modifications needed. Ready to ship today.",
        ];

        return fake()->randomElement($notes);
    }

    protected function attachPhotos(Offer $offer, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            try {
                $imagePath = ImageCache::getPartImage();
                $offer->addMedia($imagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('photos');
            } catch (\Exception $e) {
                // Skip if image download fails
            }
        }
    }
}
