<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CarListingResource\Pages;
use App\Filament\Resources\CarListingResource\RelationManagers;
use App\Models\CarListing;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Illuminate\Database\Eloquent\Builder;

class CarListingResource extends Resource
{
    protected static ?string $model = CarListing::class;

    protected static ?string $navigationIcon = 'heroicon-o-truck';

    protected static ?string $navigationGroup = 'Marketplace';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Listing Details')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Seller')
                            ->relationship('user', 'full_name', fn (Builder $query) => $query->where('user_type', 'seller'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'sold' => 'Sold',
                                'expired' => 'Expired',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Listing')
                            ->helperText('Show in featured section'),
                    ])->columns(3),

                Forms\Components\Section::make('Vehicle Information')
                    ->schema([
                        Forms\Components\TextInput::make('make')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('model')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('year')
                            ->required()
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(date('Y') + 1),
                        Forms\Components\TextInput::make('mileage')
                            ->required()
                            ->numeric()
                            ->suffix('km'),
                    ])->columns(4),

                Forms\Components\Section::make('Specifications')
                    ->schema([
                        Forms\Components\Select::make('fuel_type')
                            ->options([
                                'petrol' => 'Petrol',
                                'diesel' => 'Diesel',
                                'electric' => 'Electric',
                                'hybrid' => 'Hybrid',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\Select::make('transmission')
                            ->options([
                                'automatic' => 'Automatic',
                                'manual' => 'Manual',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('L'),
                        Forms\Components\TextInput::make('location')
                            ->required()
                            ->maxLength(255),
                    ])->columns(4),

                Forms\Components\Section::make('Description')
                    ->schema([
                        Forms\Components\Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Photos')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('photos')
                            ->collection('photos')
                            ->multiple()
                            ->maxFiles(10)
                            ->image()
                            ->imageEditor()
                            ->reorderable(),
                    ])->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('photos')
                    ->collection('photos')
                    ->conversion('thumb')
                    ->circular()
                    ->limit(1),
                Tables\Columns\TextColumn::make('make')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('model')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('year')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.full_name')
                    ->label('Seller')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('ALL')
                    ->sortable(),
                Tables\Columns\TextColumn::make('mileage')
                    ->numeric()
                    ->suffix(' km')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('fuel_type')
                    ->colors([
                        'success' => 'electric',
                        'warning' => 'hybrid',
                        'info' => 'petrol',
                        'gray' => 'diesel',
                    ]),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'active',
                        'primary' => 'sold',
                        'danger' => 'expired',
                    ]),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'sold' => 'Sold',
                        'expired' => 'Expired',
                    ]),
                Tables\Filters\SelectFilter::make('fuel_type')
                    ->options([
                        'petrol' => 'Petrol',
                        'diesel' => 'Diesel',
                        'electric' => 'Electric',
                        'hybrid' => 'Hybrid',
                    ]),
                Tables\Filters\SelectFilter::make('transmission')
                    ->options([
                        'automatic' => 'Automatic',
                        'manual' => 'Manual',
                    ]),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCarListings::route('/'),
            'edit' => Pages\EditCarListing::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
