<?php

namespace App\Models\Club;

use App\Enums\RsvpStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubEventRsvp extends Model
{
    protected $fillable = [
        'club_event_id',
        'user_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => RsvpStatus::class,
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(ClubEvent::class, 'club_event_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
