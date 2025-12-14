<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class PartRequest extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $appends = ['photos', 'budget'];

    protected $fillable = [
        'user_id',
        'car_make',
        'car_model',
        'car_year',
        'engine',
        'part_name',
        'description',
        'condition_preference',
        'offer_deadline',
        'budget_min',
        'budget_max',
        'location',
        'urgency',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'car_year' => 'integer',
            'offer_deadline' => 'datetime',
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photos');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->sharpen(10);
    }

    public function getPhotosAttribute()
    {
        return $this->getMedia('photos')->map(fn($media) => [
            'id' => $media->id,
            'url' => $media->getUrl(),
            'thumb' => $media->getUrl('thumb'),
        ]);
    }

    public function getBudgetAttribute()
    {
        if ($this->budget_min && $this->budget_max) {
            return "L" . number_format($this->budget_min, 0) . " - L" . number_format($this->budget_max, 0);
        } elseif ($this->budget_max) {
            return "Up to L" . number_format($this->budget_max, 0);
        } elseif ($this->budget_min) {
            return "From L" . number_format($this->budget_min, 0);
        }
        return null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function acceptedOffer()
    {
        return $this->offers()->where('status', 'accepted')->first();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForBuyer($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
