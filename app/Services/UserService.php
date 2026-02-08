<?php

namespace App\Services;

use App\Models\User;
use App\Models\Vehicle;

class UserService
{
    public function follow(User $follower, User $target): void
    {
        if ($follower->id === $target->id) {
            return;
        }

        $follower->following()->syncWithoutDetaching([$target->id]);
    }

    public function unfollow(User $follower, User $target): void
    {
        $follower->following()->detach($target->id);
    }

    public function toggleVehicleLike(User $user, Vehicle $vehicle): bool
    {
        $exists = $user->likedVehicles()->where('vehicle_id', $vehicle->id)->exists();

        if ($exists) {
            $user->likedVehicles()->detach($vehicle->id);

            return false;
        }

        $user->likedVehicles()->attach($vehicle->id);

        return true;
    }
}
