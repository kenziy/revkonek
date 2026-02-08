<?php

namespace App\Models;

use App\Enums\VehicleModCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleMod extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'category',
        'name',
        'brand',
        'description',
        'price',
        'currency',
        'installed_at',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'category' => VehicleModCategory::class,
            'price' => 'decimal:2',
            'installed_at' => 'date',
            'sort_order' => 'integer',
        ];
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
