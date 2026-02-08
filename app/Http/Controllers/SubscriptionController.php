<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubscriptionRequest;
use App\Models\Subscription\Subscription;
use App\Models\Subscription\SubscriptionPlan;
use App\Services\SubscriptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function __construct(
        private SubscriptionService $subscriptionService,
    ) {}

    public function index(Request $request): Response
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $activeSubscription = Subscription::where('user_id', $request->user()->id)
            ->whereIn('status', ['active', 'trialing'])
            ->with('plan')
            ->first();

        $latestSubscription = null;
        if (! $activeSubscription) {
            $latestSubscription = Subscription::where('user_id', $request->user()->id)
                ->whereIn('status', ['pending_verification', 'rejected'])
                ->with(['plan', 'coupon'])
                ->latest()
                ->first();
        }

        return Inertia::render('Subscription/Index', [
            'plans' => $plans,
            'activeSubscription' => $activeSubscription,
            'latestSubscription' => $latestSubscription,
        ]);
    }

    public function store(StoreSubscriptionRequest $request): RedirectResponse
    {
        $plan = SubscriptionPlan::findOrFail($request->input('plan_id'));

        try {
            $this->subscriptionService->subscribe($request->user(), $plan, $request->validated());
        } catch (\Exception $e) {
            return back()->withErrors(['subscription' => $e->getMessage()]);
        }

        return back()->with('success', 'Your subscription request has been submitted. We will review your payment receipt shortly.');
    }

    public function validateCoupon(Request $request)
    {
        $request->validate([
            'coupon_code' => ['required', 'string'],
            'plan_id' => ['required', 'exists:subscription_plans,id'],
        ]);

        $plan = SubscriptionPlan::findOrFail($request->input('plan_id'));
        $result = $this->subscriptionService->validateCoupon($request->input('coupon_code'), (float) $plan->price);

        return response()->json([
            'valid' => $result['valid'],
            'discount' => $result['discount'] ?? null,
            'final_amount' => $result['final_amount'] ?? null,
            'error' => $result['error'] ?? null,
        ]);
    }
}
