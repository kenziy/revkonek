<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Services\FeedService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private FeedService $feedService,
    ) {}

    public function index(): Response
    {
        $user = Auth::user();

        // Calculate onboarding progress using direct queries to avoid model dependency issues
        $onboarding = [
            'hasBike' => DB::table('vehicles')->where('user_id', $user->id)->exists(),
            'hasEmergencyContact' => DB::table('emergency_contacts')->where('user_id', $user->id)->exists(),
            'hasProfileComplete' => $this->isProfileComplete($user),
            'hasJoinedClub' => DB::table('club_members')->where('user_id', $user->id)->exists(),
        ];

        $completedSteps = collect($onboarding)->filter()->count();
        $totalSteps = count($onboarding);
        $onboardingComplete = $completedSteps === $totalSteps || $user->onboarding_skipped_at !== null;

        // Get user's primary vehicle
        $primaryBike = Vehicle::where('user_id', $user->id)
            ->where('is_active', true)
            ->with('primaryPhoto')
            ->first();

        $props = [
            'onboarding' => $onboarding,
            'onboardingComplete' => $onboardingComplete,
            'completedSteps' => $completedSteps,
            'totalSteps' => $totalSteps,
            'primaryBike' => $primaryBike ? [
                'id' => $primaryBike->id,
                'uuid' => $primaryBike->uuid,
                'make' => $primaryBike->make,
                'model' => $primaryBike->model,
                'year' => $primaryBike->year,
                'photo' => $primaryBike->primaryPhoto?->path
                    ? Storage::url($primaryBike->primaryPhoto->path)
                    : null,
            ] : null,
        ];

        // Add feed data only for users who completed onboarding
        if ($onboardingComplete) {
            $props['feed'] = $this->feedService->getFeed($user);
            $props['sidebarEvents'] = $this->feedService->getSidebarEvents($user);
            $props['userClubs'] = $this->feedService->getUserClubs($user);
        }

        return Inertia::render('Dashboard', $props);
    }

    public function feed(Request $request): JsonResponse
    {
        $request->validate([
            'offset' => 'integer|min:0',
            'limit' => 'integer|min:1|max:50',
        ]);

        $user = Auth::user();
        $offset = (int) $request->input('offset', 0);
        $limit = (int) $request->input('limit', 15);

        return response()->json(
            $this->feedService->getFeed($user, $offset, $limit)
        );
    }

    public function skipOnboarding(): RedirectResponse
    {
        $user = Auth::user();
        $user->update(['onboarding_skipped_at' => now()]);

        return redirect()->route('dashboard');
    }

    private function isProfileComplete($user): bool
    {
        return ! empty($user->name) && ! empty($user->email);
    }
}
