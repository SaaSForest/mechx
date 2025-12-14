<?php

namespace App\Filament\Widgets;

use App\Models\Offer;
use App\Models\PartRequest;
use App\Models\Review;
use App\Models\User;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentActivity extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Recent Part Requests';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                PartRequest::query()
                    ->with(['user', 'offers'])
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('part_name')
                    ->label('Part')
                    ->limit(30),
                Tables\Columns\TextColumn::make('user.full_name')
                    ->label('Buyer'),
                Tables\Columns\TextColumn::make('car_make')
                    ->label('Make'),
                Tables\Columns\TextColumn::make('car_model')
                    ->label('Model'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'active',
                        'warning' => 'pending',
                        'primary' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('offers_count')
                    ->counts('offers')
                    ->label('Offers')
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->since(),
            ])
            ->paginated(false);
    }
}
