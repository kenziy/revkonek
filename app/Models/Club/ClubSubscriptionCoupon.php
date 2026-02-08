<?php

namespace App\Models\Club;

use App\Enums\CouponDiscountType;
use Illuminate\Database\Eloquent\Model;

class ClubSubscriptionCoupon extends Model
{
    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'max_uses',
        'times_used',
        'min_amount',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'discount_type' => CouponDiscountType::class,
            'discount_value' => 'decimal:2',
            'min_amount' => 'decimal:2',
            'max_uses' => 'integer',
            'times_used' => 'integer',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->max_uses !== null && $this->times_used >= $this->max_uses) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $amount): float
    {
        if ($this->min_amount !== null && $amount < (float) $this->min_amount) {
            return 0;
        }

        return match ($this->discount_type) {
            CouponDiscountType::PERCENTAGE => round($amount * ((float) $this->discount_value / 100), 2),
            CouponDiscountType::FIXED => min((float) $this->discount_value, $amount),
        };
    }
}
