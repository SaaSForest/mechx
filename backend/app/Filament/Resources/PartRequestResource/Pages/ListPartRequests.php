<?php

namespace App\Filament\Resources\PartRequestResource\Pages;

use App\Filament\Resources\PartRequestResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPartRequests extends ListRecords
{
    protected static string $resource = PartRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
