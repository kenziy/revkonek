<?php

namespace App\Models\Club;

use App\Enums\ClubEventType;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClubEvent extends Model
{
    protected $fillable = [
        'club_id',
        'type',
        'created_by',
        'title',
        'description',
        'location_name',
        'latitude',
        'longitude',
        'starts_at',
        'ends_at',
        'max_attendees',
        'route_link',
        'is_cancelled',
    ];

    protected function casts(): array
    {
        return [
            'type' => ClubEventType::class,
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_cancelled' => 'boolean',
        ];
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function rsvps(): HasMany
    {
        return $this->hasMany(ClubEventRsvp::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(ClubEventAttendance::class);
    }
}
