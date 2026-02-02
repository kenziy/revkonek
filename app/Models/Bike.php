<?php

namespace App\Models;

use App\Enums\BikeCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bike extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'make',
        'model',
        'year',
        'cc',
        'category',
        'modification_level',
        'color',
        'plate_number',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'year' => 'integer',
        'cc' => 'integer',
        'is_active' => 'boolean',
        'category' => BikeCategory::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function photos()
    {
        return $this->hasMany(BikePhoto::class);
    }

    public function primaryPhoto()
    {
        return $this->hasOne(BikePhoto::class)->where('is_primary', true);
    }
}
