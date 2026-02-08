<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ClubSubscriptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminVerifyClubSubscriptionRequest;
use App\Http\Requests\StoreClubSubscriptionCouponRequest;
use App\Http\Requests\UpdateClubSubscriptionCouponRequest;
use App\Models\Club\ClubSubscription;
use App\Models\Club\ClubSubscriptionCoupon;
use App\Models\Club\ClubSubscriptionSetting;
use App\Services\AdminService;
use App\Services\ClubSubscriptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminClubSubscriptionController extends Controller
{
    public function __construct(
        private AdminService $adminService,
        private ClubSubscriptionService $subscriptionService,
    ) {}

    public function index(Request $request): Response
    {
        $stats = [
            'pending' => ClubSubscription::where('status', ClubSubscriptionStatus::PENDING_VERIFICATION)->count(),
            'active' => ClubSubscription::where('status', ClubSubscriptionStatus::ACTIVE)->count(),
            'expired' => ClubSubscription::where('status', ClubSubscriptionStatus::EXPIRED)->count(),
            'rejected' => ClubSubscription::where('status', ClubSubscriptionStatus::REJECTED)->count(),
            'totalRevenue' => ClubSubscription::where('status', ClubSubscriptionStatus::ACTIVE)->sum('amount'),
        ];

        $query = ClubSubscription::with(['club:id,name,slug,avatar', 'requester:id,name,username', 'coupon:id,code']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->whereHas('club', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $subscriptions = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/ClubSubscriptions/Index', [
            'stats' => $stats,
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(ClubSubscription $subscription): Response
    {
        $subscription->load(['club.owner:id,name,username', 'requester:id,name,username,email', 'verifier:id,name,username', 'coupon']);

        return Inertia::render('Admin/ClubSubscriptions/Show', [
            'subscription' => $subscription,
        ]);
    }

    public function verify(AdminVerifyClubSubscriptionRequest $request, ClubSubscription $subscription): RedirectResponse
    {
        if ($request->input('action') === 'approve') {
            $this->subscriptionService->approve($subscription, Auth::user(), $request->input('admin_note'));

            $this->adminService->logAction(
                'club_subscription.approved',
                ClubSubscription::class,
                $subscription->id,
            );

            return back()->with('success', 'Subscription approved successfully.');
        }

        $this->subscriptionService->reject($subscription, Auth::user(), $request->input('admin_note'));

        $this->adminService->logAction(
            'club_subscription.rejected',
            ClubSubscription::class,
            $subscription->id,
        );

        return back()->with('success', 'Subscription rejected.');
    }

    public function pricing(): Response
    {
        $settings = ClubSubscriptionSetting::current() ?? new ClubSubscriptionSetting([
            'yearly_price' => 999.00,
            'currency' => 'PHP',
            'is_active' => true,
        ]);

        return Inertia::render('Admin/ClubSubscriptions/Pricing', [
            'settings' => $settings,
        ]);
    }

    public function updatePricing(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'yearly_price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:10'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ]);

        $settings = ClubSubscriptionSetting::first();

        if ($settings) {
            $old = $settings->only(['yearly_price', 'currency', 'description', 'is_active']);
            $settings->update($validated);
        } else {
            $settings = ClubSubscriptionSetting::create($validated);
            $old = null;
        }

        $this->adminService->logAction(
            'club_subscription_pricing.updated',
            ClubSubscriptionSetting::class,
            $settings->id,
            $old,
            $validated,
        );

        return back()->with('success', 'Pricing updated successfully.');
    }

    public function coupons(Request $request): Response
    {
        $query = ClubSubscriptionCoupon::query();

        if ($search = $request->input('search')) {
            $query->where('code', 'like', "%{$search}%");
        }

        $coupons = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/ClubSubscriptions/Coupons', [
            'coupons' => $coupons,
            'filters' => $request->only(['search']),
        ]);
    }

    public function storeCoupon(StoreClubSubscriptionCouponRequest $request): RedirectResponse
    {
        $coupon = ClubSubscriptionCoupon::create($request->validated());

        $this->adminService->logAction(
            'club_subscription_coupon.created',
            ClubSubscriptionCoupon::class,
            $coupon->id,
        );

        return back()->with('success', 'Coupon created successfully.');
    }

    public function updateCoupon(UpdateClubSubscriptionCouponRequest $request, ClubSubscriptionCoupon $coupon): RedirectResponse
    {
        $old = $coupon->only(['code', 'discount_type', 'discount_value', 'max_uses', 'is_active']);
        $coupon->update($request->validated());

        $this->adminService->logAction(
            'club_subscription_coupon.updated',
            ClubSubscriptionCoupon::class,
            $coupon->id,
            $old,
            $request->validated(),
        );

        return back()->with('success', 'Coupon updated successfully.');
    }

    public function toggleCoupon(ClubSubscriptionCoupon $coupon): RedirectResponse
    {
        $coupon->update(['is_active' => ! $coupon->is_active]);

        return back()->with('success', $coupon->is_active ? 'Coupon activated.' : 'Coupon deactivated.');
    }

    public function destroyCoupon(ClubSubscriptionCoupon $coupon): RedirectResponse
    {
        $this->adminService->logAction(
            'club_subscription_coupon.deleted',
            ClubSubscriptionCoupon::class,
            $coupon->id,
        );

        $coupon->delete();

        return back()->with('success', 'Coupon deleted.');
    }
}
