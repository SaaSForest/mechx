<?php

namespace App\Filament\Widgets;

use App\Models\CarListing;
use App\Models\Offer;
use App\Models\PartRequest;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $totalUsers = User::count();
        $buyers = User::where('user_type', 'buyer')->count();
        $sellers = User::where('user_type', 'seller')->count();

        $activeRequests = PartRequest::where('status', 'active')->count();
        $totalRequests = PartRequest::count();

        $pendingOffers = Offer::where('status', 'pending')->count();
        $acceptedOffers = Offer::where('status', 'accepted')->count();

        $activeListings = CarListing::where('status', 'active')->count();
        $featuredListings = CarListing::where('is_featured', true)->count();

        $totalRevenue = Offer::where('status', 'accepted')->sum('price');

        return [
            Stat::make('Total Users', $totalUsers)
                ->description("$buyers buyers, $sellers sellers")
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'),

            Stat::make('Active Requests', $activeRequests)
                ->description("$totalRequests total requests")
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color('success'),

            Stat::make('Pending Offers', $pendingOffers)
                ->description("$acceptedOffers accepted")
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('warning'),

            Stat::make('Car Listings', $activeListings)
                ->description("$featuredListings featured")
                ->descriptionIcon('heroicon-m-truck')
                ->color('info'),

            Stat::make('Total Revenue', 'L ' . number_format($totalRevenue, 0, ',', '.'))
                ->description('From accepted offers')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }
}
