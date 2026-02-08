<?php

namespace App\Models\Club;

use App\Enums\ClubSubscriptionStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubSubscription extends Model
{
    protected $fillable = [
        'club_id',
        'requested_by',
        'status',
        'amount',
        'original_amount',
        'currency',
        'coupon_id',
        'receipt_path',
        'starts_at',
        'ends_at',
        'verified_by',
        'verified_at',
        'admin_note',
        'rejected_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ClubSubscriptionStatus::class,
            'amount' => 'decimal:2',
            'original_amount' => 'decimal:2',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'verified_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(ClubSubscriptionCoupon::class, 'coupon_id');
    }

    public function isActive(): bool
    {
        return $this->status === ClubSubscriptionStatus::ACTIVE
            && $this->ends_at
            && $this->ends_at->isFuture();
    }

    public function isPending(): bool
    {
        return $this->status === ClubSubscriptionStatus::PENDING_VERIFICATION;
    }
}
