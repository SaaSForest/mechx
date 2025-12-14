<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConversationResource\Pages;
use App\Filament\Resources\ConversationResource\RelationManagers;
use App\Models\Conversation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ConversationResource extends Resource
{
    protected static ?string $model = Conversation::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationGroup = 'Communication';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Conversation Details')
                    ->schema([
                        Forms\Components\Select::make('participant_one_id')
                            ->label('Participant 1')
                            ->relationship('participantOne', 'full_name')
                            ->disabled(),
                        Forms\Components\Select::make('participant_two_id')
                            ->label('Participant 2')
                            ->relationship('participantTwo', 'full_name')
                            ->disabled(),
                        Forms\Components\TextInput::make('context_type')
                            ->disabled(),
                        Forms\Components\TextInput::make('context_id')
                            ->disabled(),
                        Forms\Components\DateTimePicker::make('last_message_at')
                            ->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('participantOne.full_name')
                    ->label('Participant 1')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('participantTwo.full_name')
                    ->label('Participant 2')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('context_type')
                    ->label('Context')
                    ->colors([
                        'info' => 'part_request',
                        'success' => 'car_listing',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'part_request' => 'Part Request',
                        'car_listing' => 'Car Listing',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('messages_count')
                    ->counts('messages')
                    ->label('Messages')
                    ->badge(),
                Tables\Columns\TextColumn::make('last_message_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Last Activity'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('last_message_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('context_type')
                    ->options([
                        'part_request' => 'Part Request',
                        'car_listing' => 'Car Listing',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Conversation Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('participantOne.full_name')
                            ->label('Participant 1'),
                        Infolists\Components\TextEntry::make('participantTwo.full_name')
                            ->label('Participant 2'),
                        Infolists\Components\TextEntry::make('context_type')
                            ->label('Context Type')
                            ->badge(),
                        Infolists\Components\TextEntry::make('last_message_at')
                            ->label('Last Activity')
                            ->dateTime(),
                    ])->columns(2),

                Infolists\Components\Section::make('Messages')
                    ->schema([
                        Infolists\Components\RepeatableEntry::make('messages')
                            ->schema([
                                Infolists\Components\TextEntry::make('sender.full_name')
                                    ->label('From'),
                                Infolists\Components\TextEntry::make('content')
                                    ->label('Message'),
                                Infolists\Components\IconEntry::make('is_read')
                                    ->boolean()
                                    ->label('Read'),
                                Infolists\Components\TextEntry::make('created_at')
                                    ->dateTime()
                                    ->label('Sent'),
                            ])->columns(4),
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
            'index' => Pages\ListConversations::route('/'),
            'view' => Pages\ViewConversation::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit($record): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }
}
