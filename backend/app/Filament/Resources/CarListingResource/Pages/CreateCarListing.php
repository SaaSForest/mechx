<?php

namespace App\Filament\Resources\CarListingResource\Pages;

use App\Filament\Resources\CarListingResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateCarListing extends CreateRecord
{
    protected static string $resource = CarListingResource::class;
}
