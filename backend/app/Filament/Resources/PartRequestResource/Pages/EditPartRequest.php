<?php

namespace App\Filament\Resources\PartRequestResource\Pages;

use App\Filament\Resources\PartRequestResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPartRequest extends EditRecord
{
    protected static string $resource = PartRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
