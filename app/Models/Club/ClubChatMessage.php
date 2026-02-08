<?php

namespace App\Models\Club;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubChatMessage extends Model
{
    protected $fillable = [
        'club_id',
        'user_id',
        'message',
        'attachment',
    ];

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
