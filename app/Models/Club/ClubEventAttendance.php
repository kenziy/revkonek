<?php

namespace App\Models\Club;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubEventAttendance extends Model
{
    protected $fillable = [
        'club_event_id',
        'user_id',
        'marked_by',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(ClubEvent::class, 'club_event_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}
