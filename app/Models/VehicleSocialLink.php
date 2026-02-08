<?php

namespace App\Models;

use App\Enums\SocialPlatform;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleSocialLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'platform',
        'url',
        'label',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'platform' => SocialPlatform::class,
            'sort_order' => 'integer',
        ];
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
