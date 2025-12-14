<?php

namespace Database\Seeders\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ImageCache
{
    protected static string $cacheDir = 'database/seeders/images';

    // Pexels car images (free to use)
    protected static array $carImages = [
        'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=800',
        'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800',
        'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?w=800',
        'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?w=800',
        'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?w=800',
        'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?w=800',
        'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?w=800',
        'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?w=800',
        'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?w=800',
        'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=800',
        'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?w=800',
        'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?w=800',
        'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg?w=800',
        'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?w=800',
        'https://images.pexels.com/photos/977003/pexels-photo-977003.jpeg?w=800',
        'https://images.pexels.com/photos/3156482/pexels-photo-3156482.jpeg?w=800',
        'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?w=800',
        'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=800',
        'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?w=800',
        'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=800',
    ];

    // Pexels people images (professional headshots)
    protected static array $peopleImages = [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=400',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400',
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=400',
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=400',
        'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?w=400',
        'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=400',
        'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=400',
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=400',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400',
        'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?w=400',
        'https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?w=400',
        'https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg?w=400',
        'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?w=400',
        'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?w=400',
        'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?w=400',
        'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?w=400',
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=400',
        'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?w=400',
        'https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg?w=400',
        'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?w=400',
    ];

    // Pexels car parts/mechanical images
    protected static array $partImages = [
        'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=600',
        'https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?w=600',
        'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?w=600',
        'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?w=600',
        'https://images.pexels.com/photos/4489710/pexels-photo-4489710.jpeg?w=600',
        'https://images.pexels.com/photos/4315570/pexels-photo-4315570.jpeg?w=600',
        'https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg?w=600',
        'https://images.pexels.com/photos/4315566/pexels-photo-4315566.jpeg?w=600',
        'https://images.pexels.com/photos/4315557/pexels-photo-4315557.jpeg?w=600',
        'https://images.pexels.com/photos/5835359/pexels-photo-5835359.jpeg?w=600',
    ];

    protected static int $carIndex = 0;
    protected static int $peopleIndex = 0;
    protected static int $partIndex = 0;

    public static function getCarImage(): string
    {
        $url = self::$carImages[self::$carIndex % count(self::$carImages)];
        self::$carIndex++;
        return self::downloadOrCache($url, 'cars');
    }

    public static function getPersonImage(): string
    {
        $url = self::$peopleImages[self::$peopleIndex % count(self::$peopleImages)];
        self::$peopleIndex++;
        return self::downloadOrCache($url, 'people');
    }

    public static function getPartImage(): string
    {
        $url = self::$partImages[self::$partIndex % count(self::$partImages)];
        self::$partIndex++;
        return self::downloadOrCache($url, 'parts');
    }

    protected static function downloadOrCache(string $url, string $type): string
    {
        $filename = md5($url) . '.jpg';
        $localPath = base_path(self::$cacheDir . "/{$type}/{$filename}");

        // Check if already cached
        if (file_exists($localPath)) {
            return $localPath;
        }

        // Download the image
        try {
            $response = Http::timeout(30)->get($url);
            if ($response->successful()) {
                file_put_contents($localPath, $response->body());
                return $localPath;
            }
        } catch (\Exception $e) {
            // If download fails, return a fallback path or throw
            throw new \Exception("Failed to download image from {$url}: " . $e->getMessage());
        }

        return $localPath;
    }

    public static function resetIndexes(): void
    {
        self::$carIndex = 0;
        self::$peopleIndex = 0;
        self::$partIndex = 0;
    }
}
