<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'vehicle_type_id',
        'vehicle_category_id',
        'make',
        'model',
        'year',
        'modification_level',
        'color',
        'plate_number',
        'notes',
        'is_active',
        'is_available_for_match',
        'legacy_bike_id',
    ];

    protected $casts = [
        'year' => 'integer',
        'is_active' => 'boolean',
        'is_available_for_match' => 'boolean',
    ];

    protected $appends = ['display_name', 'engine_spec'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(VehicleCategory::class, 'vehicle_category_id');
    }

    public function bikeDetails(): HasOne
    {
        return $this->hasOne(BikeDetails::class);
    }

    public function carDetails(): HasOne
    {
        return $this->hasOne(CarDetails::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(VehiclePhoto::class)->orderBy('sort_order');
    }

    public function primaryPhoto(): HasOne
    {
        return $this->hasOne(VehiclePhoto::class)->where('is_primary', true);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailableForMatch($query)
    {
        return $query->where('is_available_for_match', true);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeBikes($query)
    {
        return $query->whereHas('vehicleType', fn ($q) => $q->where('slug', 'bike'));
    }

    public function scopeCars($query)
    {
        return $query->whereHas('vehicleType', fn ($q) => $q->where('slug', 'car'));
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        return "{$this->year} {$this->make} {$this->model}";
    }

    public function getEngineSpecAttribute(): ?string
    {
        if ($this->vehicleType?->isBike() && $this->bikeDetails) {
            return $this->bikeDetails->cc.'cc';
        }

        if ($this->vehicleType?->isCar() && $this->carDetails) {
            if ($this->carDetails->engine_liters) {
                return $this->carDetails->engine_liters.'L';
            }
            if ($this->carDetails->horsepower) {
                return $this->carDetails->horsepower.'hp';
            }
        }

        return null;
    }

    // Helper methods
    public function isBike(): bool
    {
        return $this->vehicleType?->isBike() ?? false;
    }

    public function isCar(): bool
    {
        return $this->vehicleType?->isCar() ?? false;
    }

    public function getPrimaryPhotoUrl(): ?string
    {
        $photo = $this->primaryPhoto ?? $this->photos->first();

        return $photo ? asset('storage/'.$photo->path) : null;
    }

    public function setAsActive(): void
    {
        // Deactivate all other vehicles for this user
        Vehicle::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_active' => false]);

        $this->update(['is_active' => true]);
    }

    public function toggleMatchAvailability(): void
    {
        $this->update(['is_available_for_match' => ! $this->is_available_for_match]);
    }
}
