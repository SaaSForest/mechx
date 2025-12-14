<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class User extends Authenticatable implements HasMedia, FilamentUser
{
    use HasFactory, Notifiable, HasApiTokens, InteractsWithMedia;

    protected $fillable = [
        'full_name',
        'email',
        'password',
        'phone',
        'user_type',
        'business_name',
        'business_address',
        'specialty',
        'is_verified',
        'is_admin',
        'rating',
        'sales_count',
        'expo_push_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'is_admin' => 'boolean',
            'rating' => 'decimal:1',
            'sales_count' => 'integer',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile_photo')
            ->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(100)
            ->height(100)
            ->sharpen(10);
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('profile_photo');
        return $media ? $media->getUrl() : null;
    }

    public function getProfilePhotoThumbAttribute(): ?string
    {
        $media = $this->getFirstMedia('profile_photo');
        return $media ? $media->getUrl('thumb') : null;
    }

    public function isBuyer(): bool
    {
        return $this->user_type === 'buyer';
    }

    public function isSeller(): bool
    {
        return $this->user_type === 'seller';
    }

    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin === true;
    }

    public function getFilamentName(): string
    {
        return $this->full_name ?? $this->email;
    }

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->profile_photo_url;
    }

    public function getNameAttribute(): string
    {
        return $this->full_name ?? $this->email;
    }

    public function partRequests(): HasMany
    {
        return $this->hasMany(PartRequest::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'seller_id');
    }

    public function carListings(): HasMany
    {
        return $this->hasMany(CarListing::class);
    }

    public function conversationsAsParticipantOne(): HasMany
    {
        return $this->hasMany(Conversation::class, 'participant_one_id');
    }

    public function conversationsAsParticipantTwo(): HasMany
    {
        return $this->hasMany(Conversation::class, 'participant_two_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewed_user_id');
    }

    public function reviewsGiven(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function recalculateRating(): void
    {
        $avgRating = $this->reviewsReceived()->avg('rating');
        $this->update(['rating' => $avgRating ? round($avgRating, 1) : 0]);
    }
}
