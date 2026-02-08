<?php

namespace App\Models\Subscription;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_id',
        'status',
        'starts_at',
        'ends_at',
        'trial_ends_at',
        'cancelled_at',
        'grace_period_ends_at',
        'payment_provider',
        'payment_provider_id',
        'receipt_path',
        'amount',
        'original_amount',
        'currency',
        'coupon_id',
        'verified_by',
        'verified_at',
        'admin_note',
        'rejected_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'original_amount' => 'decimal:2',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'grace_period_ends_at' => 'datetime',
            'verified_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(SubscriptionCoupon::class, 'coupon_id');
    }

    public function isActive(): bool
    {
        if ($this->status === 'active') {
            return ! $this->ends_at || $this->ends_at->isFuture();
        }

        if ($this->status === 'trialing' && $this->trial_ends_at) {
            return $this->trial_ends_at->isFuture();
        }

        if ($this->status === 'cancelled' && $this->grace_period_ends_at) {
            return $this->grace_period_ends_at->isFuture();
        }

        return false;
    }

    public function isPending(): bool
    {
        return $this->status === 'pending_verification';
    }
}
