<?php

namespace Database\Seeders;

use Database\Seeders\Helpers\ImageCache;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure image cache directories exist
        $this->ensureImageCacheDirectories();

        // Reset image indexes for consistent seeding
        ImageCache::resetIndexes();

        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
            PartRequestSeeder::class,
            CarListingSeeder::class,
            OfferSeeder::class,
            ConversationSeeder::class,
            MessageSeeder::class,
            NotificationSeeder::class,
        ]);
    }

    protected function ensureImageCacheDirectories(): void
    {
        $baseDir = base_path('database/seeders/images');

        foreach (['cars', 'people', 'parts'] as $type) {
            $dir = "{$baseDir}/{$type}";
            if (!File::exists($dir)) {
                File::makeDirectory($dir, 0755, true);
            }
        }
    }
}
