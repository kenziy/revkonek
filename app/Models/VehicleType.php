<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleType extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'icon',
        'is_enabled',
        'sort_order',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(VehicleCategory::class)->orderBy('sort_order');
    }

    public function enabledCategories(): HasMany
    {
        return $this->hasMany(VehicleCategory::class)
            ->where('is_enabled', true)
            ->orderBy('sort_order');
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function isBike(): bool
    {
        return $this->slug === 'bike';
    }

    public function isCar(): bool
    {
        return $this->slug === 'car';
    }
}
