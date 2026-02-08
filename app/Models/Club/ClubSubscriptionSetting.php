<?php

namespace App\Models\Club;

use Illuminate\Database\Eloquent\Model;

class ClubSubscriptionSetting extends Model
{
    protected $fillable = [
        'yearly_price',
        'currency',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'yearly_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public static function current(): ?self
    {
        return static::where('is_active', true)->first();
    }
}
