<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    public function index(): Response
    {
        $currentUser = Auth::user();

        // Get blocked user IDs to exclude
        $blockedIds = DB::table('user_blocks')
            ->where('user_id', $currentUser->id)
            ->pluck('blocked_user_id')
            ->toArray();

        $blockedByIds = DB::table('user_blocks')
            ->where('blocked_user_id', $currentUser->id)
            ->pluck('user_id')
            ->toArray();

        $excludeUserIds = array_unique(array_merge($blockedIds, $blockedByIds, [$currentUser->id]));

        // Base query: vehicles from other users
        $baseQuery = Vehicle::query()
            ->whereNotIn('user_id', $excludeUserIds)
            ->whereHas('user', fn ($q) => $q->where('is_active', true))
            ->with([
                'vehicleType',
                'category',
                'primaryPhoto',
                'bikeDetails',
                'carDetails',
                'user.challengeStats',
            ]);

        // Get vehicles that are available for match
        $vehiclesAvailableForMatch = (clone $baseQuery)
            ->where('is_available_for_match', true)
            ->get()
            ->map(fn ($vehicle) => $this->transformVehicleForMatch($vehicle));

        // Get all vehicles (fallback)
        $allVehicles = $baseQuery
            ->get()
            ->map(fn ($vehicle) => $this->transformVehicleForMatch($vehicle));

        // Get current user's vehicles for the toggle UI
        $myVehicles = $currentUser->vehicles()
            ->with(['vehicleType', 'primaryPhoto', 'bikeDetails', 'carDetails'])
            ->get()
            ->map(fn ($vehicle) => [
                'id' => $vehicle->id,
                'displayName' => $vehicle->display_name,
                'vehicleType' => $vehicle->vehicleType->slug,
                'engineSpec' => $vehicle->engine_spec,
                'isAvailableForMatch' => $vehicle->is_available_for_match,
                'photo' => $vehicle->primaryPhoto?->path
                    ? Storage::url($vehicle->primaryPhoto->path)
                    : null,
            ]);

        // Get vehicle types for filtering
        $vehicleTypes = VehicleType::enabled()
            ->ordered()
            ->get()
            ->map(fn ($type) => [
                'id' => $type->id,
                'slug' => $type->slug,
                'name' => $type->name,
            ]);

        return Inertia::render('Match/Index', [
            'vehicles' => $vehiclesAvailableForMatch,
            'allVehicles' => $allVehicles,
            'myVehicles' => $myVehicles,
            'vehicleTypes' => $vehicleTypes,
            'isLookingForMatch' => (bool) $currentUser->is_looking_for_match,
        ]);
    }

    public function toggleStatus(): RedirectResponse
    {
        $user = Auth::user();
        $user->is_looking_for_match = ! $user->is_looking_for_match;
        $user->save();

        return back()->with('success', $user->is_looking_for_match
            ? 'You are now visible to other riders looking for a match.'
            : 'You are no longer visible to riders looking for a match.'
        );
    }

    public function toggleVehicleStatus(Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('toggleMatchAvailability', $vehicle);

        $vehicle->toggleMatchAvailability();

        $message = $vehicle->is_available_for_match
            ? "{$vehicle->display_name} is now available for match."
            : "{$vehicle->display_name} is no longer available for match.";

        return back()->with('success', $message);
    }

    private function transformVehicleForMatch(Vehicle $vehicle): array
    {
        $user = $vehicle->user;
        $stats = $user->challengeStats;

        return [
            'id' => $vehicle->id,
            'vehicleType' => $vehicle->vehicleType->slug,
            'vehicleTypeName' => $vehicle->vehicleType->name,
            'displayName' => $vehicle->display_name,
            'category' => $vehicle->category?->name,
            'categorySlug' => $vehicle->category?->slug,
            'engineSpec' => $vehicle->engine_spec,
            'modificationLevel' => $vehicle->modification_level,
            'isAvailableForMatch' => $vehicle->is_available_for_match,
            'photo' => $vehicle->primaryPhoto?->path
                ? Storage::url($vehicle->primaryPhoto->path)
                : null,
            'owner' => [
                'id' => $user->id,
                'name' => $user->name,
                'rating' => $stats?->skill_rating ?? 0,
                'wins' => $stats?->wins ?? 0,
            ],
            'distance' => 'N/A',
        ];
    }
}
