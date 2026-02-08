<?php

namespace App\Services;

use App\Models\Subscription\Subscription;
use App\Models\Subscription\SubscriptionCoupon;
use App\Models\Subscription\SubscriptionPlan;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    public function subscribe(User $user, SubscriptionPlan $plan, array $data): Subscription
    {
        $existingActive = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'pending_verification'])
            ->exists();

        if ($existingActive) {
            throw new \Exception('You already have an active or pending subscription.');
        }

        $originalAmount = (float) $plan->price;
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
        $receiptPath = $receipt->store("subscription-receipts/{$user->id}", 'public');

        return Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'pending_verification',
            'amount' => $amount,
            'original_amount' => $originalAmount,
            'currency' => $plan->currency,
            'coupon_id' => $couponId,
            'receipt_path' => $receiptPath,
        ]);
    }

    public function approve(Subscription $subscription, User $admin, ?string $note = null): Subscription
    {
        return DB::transaction(function () use ($subscription, $admin, $note) {
            $plan = $subscription->plan;
            $months = $plan && $plan->billing_period === 'yearly' ? 12 : 1;

            $subscription->update([
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => now()->addMonths($months),
                'verified_by' => $admin->id,
                'verified_at' => now(),
                'admin_note' => $note,
            ]);

            return $subscription->fresh();
        });
    }

    public function reject(Subscription $subscription, User $admin, string $note): Subscription
    {
        return DB::transaction(function () use ($subscription, $admin, $note) {
            $subscription->update([
                'status' => 'rejected',
                'verified_by' => $admin->id,
                'verified_at' => now(),
                'rejected_at' => now(),
                'admin_note' => $note,
            ]);

            // Refund coupon usage
            if ($subscription->coupon_id) {
                SubscriptionCoupon::where('id', $subscription->coupon_id)
                    ->where('times_used', '>', 0)
                    ->decrement('times_used');
            }

            return $subscription->fresh();
        });
    }

    public function validateCoupon(string $code, float $amount): array
    {
        $coupon = SubscriptionCoupon::where('code', $code)->first();

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
}
