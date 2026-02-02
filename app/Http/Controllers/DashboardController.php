<?php

namespace App\Http\Controllers;

use App\Models\Bike;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Calculate onboarding progress using direct queries to avoid model dependency issues
        $onboarding = [
            'hasBike' => DB::table('bikes')->where('user_id', $user->id)->exists(),
            'hasEmergencyContact' => DB::table('emergency_contacts')->where('user_id', $user->id)->exists(),
            'hasProfileComplete' => $this->isProfileComplete($user),
            'hasJoinedGroup' => DB::table('group_members')->where('user_id', $user->id)->exists(),
        ];

        $completedSteps = collect($onboarding)->filter()->count();
        $totalSteps = count($onboarding);
        $onboardingComplete = $completedSteps === $totalSteps;

        // Get user's primary bike
        $primaryBike = Bike::where('user_id', $user->id)
            ->where('is_active', true)
            ->with('primaryPhoto')
            ->first();

        // Get stats (placeholder for now)
        $stats = [
            'totalChallenges' => 0,
            'wins' => 0,
            'rating' => 0,
            'streak' => 0,
        ];

        return Inertia::render('Dashboard', [
            'onboarding' => $onboarding,
            'onboardingComplete' => $onboardingComplete,
            'completedSteps' => $completedSteps,
            'totalSteps' => $totalSteps,
            'primaryBike' => $primaryBike ? [
                'id' => $primaryBike->id,
                'make' => $primaryBike->make,
                'model' => $primaryBike->model,
                'year' => $primaryBike->year,
                'photo' => $primaryBike->primaryPhoto?->path
                    ? Storage::url($primaryBike->primaryPhoto->path)
                    : null,
            ] : null,
            'stats' => $stats,
            'nearbyRiders' => [],
            'recentActivity' => [],
        ]);
    }

    private function isProfileComplete($user): bool
    {
        return ! empty($user->name) && ! empty($user->email);
    }
}
