<?php

namespace App\Filament\Resources\CarListingResource\Pages;

use App\Filament\Resources\CarListingResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCarListings extends ListRecords
{
    protected static string $resource = CarListingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
