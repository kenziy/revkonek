<?php

namespace App\Models\Club;

use App\Enums\ClubRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubMember extends Model
{
    protected $fillable = [
        'club_id',
        'user_id',
        'role',
        'joined_at',
        'is_muted',
        'muted_until',
        'points',
    ];

    protected function casts(): array
    {
        return [
            'role' => ClubRole::class,
            'joined_at' => 'datetime',
            'is_muted' => 'boolean',
            'muted_until' => 'datetime',
            'points' => 'integer',
        ];
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
