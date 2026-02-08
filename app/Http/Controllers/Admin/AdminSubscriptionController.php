<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubscriptionCouponRequest;
use App\Http\Requests\UpdateSubscriptionCouponRequest;
use App\Models\Subscription\Subscription;
use App\Models\Subscription\SubscriptionCoupon;
use App\Models\Subscription\SubscriptionPlan;
use App\Models\User;
use App\Services\AdminService;
use App\Services\SubscriptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminSubscriptionController extends Controller
{
    public function __construct(
        private AdminService $adminService,
        private SubscriptionService $subscriptionService,
    ) {}

    public function index(Request $request): Response
    {
        $stats = [
            'totalActive' => DB::table('subscriptions')->where('status', 'active')->count(),
            'totalCancelled' => DB::table('subscriptions')->where('status', 'cancelled')->count(),
            'totalExpired' => DB::table('subscriptions')->where('status', 'expired')->count(),
            'totalTrialing' => DB::table('subscriptions')->where('status', 'trialing')->count(),
            'totalPending' => DB::table('subscriptions')->where('status', 'pending_verification')->count(),
            'totalRejected' => DB::table('subscriptions')->where('status', 'rejected')->count(),
            'totalRevenue' => DB::table('subscriptions')->where('status', 'active')->sum('amount') ?: 0,
        ];

        $query = DB::table('subscriptions')
            ->leftJoin('users', 'subscriptions.user_id', '=', 'users.id')
            ->leftJoin('subscription_plans', 'subscriptions.plan_id', '=', 'subscription_plans.id')
            ->select(
                'subscriptions.*',
                'users.name as user_name',
                'users.email as user_email',
                'subscription_plans.name as plan_name',
            );

        if ($status = $request->input('status')) {
            $query->where('subscriptions.status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('users.email', 'like', "%{$search}%");
            });
        }

        $subscriptions = $query->orderByDesc('subscriptions.created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Subscriptions/Index', [
            'stats' => $stats,
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Subscription $subscription): Response
    {
        $subscription->load(['user:id,name,username,email', 'plan', 'verifier:id,name,username', 'coupon']);

        return Inertia::render('Admin/Subscriptions/Show', [
            'subscription' => $subscription,
        ]);
    }

    public function verify(Request $request, Subscription $subscription): RedirectResponse
    {
        $request->validate([
            'action' => ['required', 'in:approve,reject'],
            'admin_note' => ['required_if:action,reject', 'nullable', 'string', 'max:1000'],
        ], [
            'admin_note.required_if' => 'A reason is required when rejecting a subscription.',
        ]);

        if ($request->input('action') === 'approve') {
            $this->subscriptionService->approve($subscription, Auth::user(), $request->input('admin_note'));

            $this->adminService->logAction(
                'subscription.approved',
                Subscription::class,
                $subscription->id,
            );

            return back()->with('success', 'Subscription approved successfully.');
        }

        $this->subscriptionService->reject($subscription, Auth::user(), $request->input('admin_note'));

        $this->adminService->logAction(
            'subscription.rejected',
            Subscription::class,
            $subscription->id,
        );

        return back()->with('success', 'Subscription rejected.');
    }

    public function plans(): Response
    {
        $plans = SubscriptionPlan::orderBy('sort_order')->get();

        return Inertia::render('Admin/Subscriptions/Plans', [
            'plans' => $plans,
        ]);
    }

    public function storePlan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:subscription_plans,slug',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'billing_period' => 'required|string|in:monthly,yearly',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['sort_order'] = SubscriptionPlan::max('sort_order') + 1;

        $plan = SubscriptionPlan::create($validated);

        $this->adminService->logAction(
            'subscription_plan.created',
            SubscriptionPlan::class,
            $plan->id,
            null,
            $validated,
        );

        return back()->with('success', 'Subscription plan created.');
    }

    public function updatePlan(Request $request, SubscriptionPlan $plan): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:subscription_plans,slug,'.$plan->id,
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'billing_period' => 'required|string|in:monthly,yearly',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $oldValues = $plan->toArray();
        $plan->update($validated);

        $this->adminService->logAction(
            'subscription_plan.updated',
            SubscriptionPlan::class,
            $plan->id,
            $oldValues,
            $validated,
        );

        return back()->with('success', 'Subscription plan updated.');
    }

    public function deletePlan(SubscriptionPlan $plan): RedirectResponse
    {
        $activeCount = Subscription::where('plan_id', $plan->id)->where('status', 'active')->count();

        if ($activeCount > 0) {
            return back()->with('error', "Cannot delete plan with {$activeCount} active subscriptions.");
        }

        $this->adminService->logAction(
            'subscription_plan.deleted',
            SubscriptionPlan::class,
            $plan->id,
            $plan->toArray(),
        );

        $plan->delete();

        return back()->with('success', 'Subscription plan deleted.');
    }

    public function grantPro(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'duration_months' => 'required|integer|min:1|max:24',
        ]);

        // Cancel existing active subscriptions
        Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $validated['plan_id'],
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addMonths($validated['duration_months']),
        ]);

        $this->adminService->logAction(
            'subscription.granted',
            User::class,
            $user->id,
            null,
            [
                'plan_id' => $validated['plan_id'],
                'duration_months' => $validated['duration_months'],
                'subscription_id' => $subscription->id,
            ],
        );

        return back()->with('success', "Pro subscription granted to {$user->name}.");
    }

    public function revokePro(User $user): RedirectResponse
    {
        $affected = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'trialing'])
            ->update(['status' => 'cancelled', 'cancelled_at' => now(), 'ends_at' => now()]);

        $this->adminService->logAction(
            'subscription.revoked',
            User::class,
            $user->id,
            ['subscriptions_cancelled' => $affected],
        );

        return back()->with('success', "Pro subscription revoked from {$user->name}.");
    }

    // Coupon management

    public function coupons(Request $request): Response
    {
        $query = SubscriptionCoupon::query();

        if ($search = $request->input('search')) {
            $query->where('code', 'like', "%{$search}%");
        }

        $coupons = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Subscriptions/Coupons', [
            'coupons' => $coupons,
            'filters' => $request->only(['search']),
        ]);
    }

    public function storeCoupon(StoreSubscriptionCouponRequest $request): RedirectResponse
    {
        $coupon = SubscriptionCoupon::create($request->validated());

        $this->adminService->logAction(
            'subscription_coupon.created',
            SubscriptionCoupon::class,
            $coupon->id,
        );

        return back()->with('success', 'Coupon created successfully.');
    }

    public function updateCoupon(UpdateSubscriptionCouponRequest $request, SubscriptionCoupon $coupon): RedirectResponse
    {
        $old = $coupon->only(['code', 'discount_type', 'discount_value', 'max_uses', 'is_active']);
        $coupon->update($request->validated());

        $this->adminService->logAction(
            'subscription_coupon.updated',
            SubscriptionCoupon::class,
            $coupon->id,
            $old,
            $request->validated(),
        );

        return back()->with('success', 'Coupon updated successfully.');
    }

    public function toggleCoupon(SubscriptionCoupon $coupon): RedirectResponse
    {
        $coupon->update(['is_active' => ! $coupon->is_active]);

        return back()->with('success', $coupon->is_active ? 'Coupon activated.' : 'Coupon deactivated.');
    }

    public function destroyCoupon(SubscriptionCoupon $coupon): RedirectResponse
    {
        $this->adminService->logAction(
            'subscription_coupon.deleted',
            SubscriptionCoupon::class,
            $coupon->id,
        );

        $coupon->delete();

        return back()->with('success', 'Coupon deleted.');
    }
}
