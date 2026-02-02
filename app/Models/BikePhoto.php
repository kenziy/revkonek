<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BikePhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'bike_id',
        'path',
        'filename',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function bike(): BelongsTo
    {
        return $this->belongsTo(Bike::class);
    }
}
