<?php

namespace App\Models\Profile;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'avatar',
        'bio',
        'city',
        'province',
        'country',
        'latitude',
        'longitude',
        'riding_experience_years',
        'riding_style',
        'is_looking_for_challenge',
        'is_online',
        'last_seen_at',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'riding_experience_years' => 'integer',
            'is_looking_for_challenge' => 'boolean',
            'is_online' => 'boolean',
            'last_seen_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
