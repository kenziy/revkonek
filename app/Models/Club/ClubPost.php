<?php

namespace App\Models\Club;

use App\Enums\PostVisibility;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubPost extends Model
{
    protected $fillable = [
        'club_id',
        'user_id',
        'content',
        'is_announcement',
        'is_pinned',
        'visibility',
    ];

    protected function casts(): array
    {
        return [
            'visibility' => PostVisibility::class,
            'is_announcement' => 'boolean',
            'is_pinned' => 'boolean',
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
