<?php

namespace App\Services;

use App\Enums\ClubSubscriptionStatus;
use App\Models\Club\Club;
use App\Models\Club\ClubSubscription;
use App\Models\Club\ClubSubscriptionCoupon;
use App\Models\Club\ClubSubscriptionSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ClubSubscriptionService
{
    public function getSettings(): ?ClubSubscriptionSetting
    {
        return ClubSubscriptionSetting::current();
    }

    public function subscribe(Club $club, User $user, array $data): ClubSubscription
    {
        $existingActive = $club->subscriptions()
            ->whereIn('status', [
                ClubSubscriptionStatus::ACTIVE,
                ClubSubscriptionStatus::PENDING_VERIFICATION,
            ])
            ->exists();

        if ($existingActive) {
            throw new \Exception('Club already has an active or pending subscription.');
        }

        $settings = $this->getSettings();

        if (! $settings) {
            throw new \Exception('Subscription pricing is not configured.');
        }

        $originalAmount = (float) $settings->yearly_price;
        $amount = $originalAmount;
        $couponId = null;

        if (! empty($data['coupon_code'])) {
            $couponResult = $this->validateCoupon($data['coupon_code'], $originalAmount);

            if ($couponResult['valid']) {
                $amount = $couponResult['final_amount'];
                $couponId = $couponResult['coupon']->id;

                $couponResult['coupon']->increment('times_used');
            }
        }

        /** @var UploadedFile $receipt */
        $receipt = $data['receipt'];
        $receiptPath = $receipt->store("club-receipts/{$club->id}", 'public');

        return $club->subscriptions()->create([
            'requested_by' => $user->id,
            'status' => ClubSubscriptionStatus::PENDING_VERIFICATION,
            'amount' => $amount,
            'original_amount' => $originalAmount,
            'currency' => $settings->currency,
            'coupon_id' => $couponId,
            'receipt_path' => $receiptPath,
        ]);
    }

    public function approve(ClubSubscription $subscription, User $admin, ?string $note = null): ClubSubscription
    {
        return DB::transaction(function () use ($subscription, $admin, $note) {
            $subscription->update([
                'status' => ClubSubscriptionStatus::ACTIVE,
                'starts_at' => now(),
                'ends_at' => now()->addYear(),
                'verified_by' => $admin->id,
                'verified_at' => now(),
                'admin_note' => $note,
            ]);

            $subscription->club->update(['is_premium' => true]);

            return $subscription->fresh();
        });
    }

    public function reject(ClubSubscription $subscription, User $admin, string $note): ClubSubscription
    {
        return DB::transaction(function () use ($subscription, $admin, $note) {
            $subscription->update([
                'status' => ClubSubscriptionStatus::REJECTED,
                'verified_by' => $admin->id,
                'verified_at' => now(),
                'rejected_at' => now(),
                'admin_note' => $note,
            ]);

            // Refund coupon usage
            if ($subscription->coupon_id) {
                ClubSubscriptionCoupon::where('id', $subscription->coupon_id)
                    ->where('times_used', '>', 0)
                    ->decrement('times_used');
            }

            return $subscription->fresh();
        });
    }

    public function validateCoupon(string $code, float $amount): array
    {
        $coupon = ClubSubscriptionCoupon::where('code', $code)->first();

        if (! $coupon) {
            return ['valid' => false, 'error' => 'Coupon not found.'];
        }

        if (! $coupon->isValid()) {
            return ['valid' => false, 'error' => 'This coupon is no longer valid.'];
        }

        $discount = $coupon->calculateDiscount($amount);

        if ($discount <= 0) {
            return ['valid' => false, 'error' => 'Coupon does not apply to this amount.'];
        }

        $finalAmount = max(0, $amount - $discount);

        return [
            'valid' => true,
            'coupon' => $coupon,
            'discount' => $discount,
            'final_amount' => $finalAmount,
            'error' => null,
        ];
    }

    public function expireOverdueSubscriptions(): int
    {
        $expired = ClubSubscription::where('status', ClubSubscriptionStatus::ACTIVE)
            ->where('ends_at', '<=', now())
            ->get();

        foreach ($expired as $subscription) {
            $subscription->update(['status' => ClubSubscriptionStatus::EXPIRED]);

            // Only downgrade if no other active subscription exists
            $hasOtherActive = $subscription->club->subscriptions()
                ->where('id', '!=', $subscription->id)
                ->where('status', ClubSubscriptionStatus::ACTIVE)
                ->where('ends_at', '>', now())
                ->exists();

            if (! $hasOtherActive) {
                $subscription->club->update(['is_premium' => false]);
            }
        }

        return $expired->count();
    }
}
