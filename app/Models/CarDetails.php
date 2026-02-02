<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'engine_liters',
        'horsepower',
        'transmission',
        'drivetrain',
        'doors',
    ];

    protected $casts = [
        'engine_liters' => 'decimal:1',
        'horsepower' => 'integer',
        'doors' => 'integer',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function getTransmissionLabel(): string
    {
        return match ($this->transmission) {
            'manual' => 'Manual',
            'automatic' => 'Automatic',
            'cvt' => 'CVT',
            'dct' => 'DCT',
            default => ucfirst($this->transmission ?? 'Unknown'),
        };
    }

    public function getDrivetrainLabel(): string
    {
        return match ($this->drivetrain) {
            'fwd' => 'FWD',
            'rwd' => 'RWD',
            'awd' => 'AWD',
            '4wd' => '4WD',
            default => strtoupper($this->drivetrain ?? 'Unknown'),
        };
    }
}
