<?php

namespace App\Filament\Resources\CarListingResource\Pages;

use App\Filament\Resources\CarListingResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCarListing extends EditRecord
{
    protected static string $resource = CarListingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
