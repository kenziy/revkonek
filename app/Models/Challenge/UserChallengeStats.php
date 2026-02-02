<?php

namespace App\Models\Challenge;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserChallengeStats extends Model
{
    protected $fillable = [
        'user_id',
        'total_challenges',
        'wins',
        'losses',
        'draws',
        'skill_rating',
        'skill_uncertainty',
        'rank',
        'current_streak',
        'best_streak',
        'disputes_filed',
        'disputes_won',
        'false_disputes',
        'last_challenge_at',
    ];

    protected $casts = [
        'total_challenges' => 'integer',
        'wins' => 'integer',
        'losses' => 'integer',
        'draws' => 'integer',
        'skill_rating' => 'decimal:2',
        'skill_uncertainty' => 'decimal:2',
        'current_streak' => 'integer',
        'best_streak' => 'integer',
        'disputes_filed' => 'integer',
        'disputes_won' => 'integer',
        'false_disputes' => 'integer',
        'last_challenge_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getWinRateAttribute(): float
    {
        if ($this->total_challenges === 0) {
            return 0;
        }

        return round(($this->wins / $this->total_challenges) * 100, 1);
    }
}
