<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PartRequestResource\Pages;
use App\Filament\Resources\PartRequestResource\RelationManagers;
use App\Models\PartRequest;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PartRequestResource extends Resource
{
    protected static ?string $model = PartRequest::class;

    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?string $navigationGroup = 'Marketplace';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'part_name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Request Details')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Buyer')
                            ->relationship('user', 'full_name', fn (Builder $query) => $query->where('user_type', 'buyer'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\TextInput::make('part_name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Vehicle Information')
                    ->schema([
                        Forms\Components\TextInput::make('car_make')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('car_model')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('car_year')
                            ->required()
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(date('Y') + 1),
                        Forms\Components\TextInput::make('engine')
                            ->maxLength(100),
                    ])->columns(4),

                Forms\Components\Section::make('Preferences')
                    ->schema([
                        Forms\Components\Select::make('condition_preference')
                            ->options([
                                'new' => 'New',
                                'used' => 'Used',
                                'any' => 'Any',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\Select::make('urgency')
                            ->options([
                                'flexible' => 'Flexible',
                                'standard' => 'Standard',
                                'urgent' => 'Urgent',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'pending' => 'Pending',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\DateTimePicker::make('offer_deadline'),
                    ])->columns(4),

                Forms\Components\Section::make('Budget & Location')
                    ->schema([
                        Forms\Components\TextInput::make('budget_min')
                            ->numeric()
                            ->prefix('L')
                            ->label('Min Budget'),
                        Forms\Components\TextInput::make('budget_max')
                            ->numeric()
                            ->prefix('L')
                            ->label('Max Budget'),
                        Forms\Components\TextInput::make('location')
                            ->maxLength(255),
                    ])->columns(3),

                Forms\Components\Section::make('Photos')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('photos')
                            ->collection('photos')
                            ->multiple()
                            ->maxFiles(5)
                            ->image()
                            ->imageEditor(),
                    ])->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('part_name')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('user.full_name')
                    ->label('Buyer')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('car_make')
                    ->searchable(),
                Tables\Columns\TextColumn::make('car_model')
                    ->searchable(),
                Tables\Columns\TextColumn::make('car_year'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'active',
                        'warning' => 'pending',
                        'primary' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\BadgeColumn::make('urgency')
                    ->colors([
                        'gray' => 'flexible',
                        'info' => 'standard',
                        'danger' => 'urgent',
                    ]),
                Tables\Columns\TextColumn::make('budget_max')
                    ->money('ALL')
                    ->label('Budget')
                    ->sortable(),
                Tables\Columns\TextColumn::make('offers_count')
                    ->counts('offers')
                    ->label('Offers')
                    ->badge(),
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
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
                Tables\Filters\SelectFilter::make('urgency')
                    ->options([
                        'flexible' => 'Flexible',
                        'standard' => 'Standard',
                        'urgent' => 'Urgent',
                    ]),
                Tables\Filters\SelectFilter::make('condition_preference')
                    ->options([
                        'new' => 'New',
                        'used' => 'Used',
                        'any' => 'Any',
                    ]),
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
            'index' => Pages\ListPartRequests::route('/'),
            'edit' => Pages\EditPartRequest::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
