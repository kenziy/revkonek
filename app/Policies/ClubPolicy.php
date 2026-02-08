<?php

namespace App\Policies;

use App\Enums\ClubRole;
use App\Enums\ClubType;
use App\Models\Club\Club;
use App\Models\User;

class ClubPolicy
{
    public function view(User $user, Club $club): bool
    {
        if ($club->type === ClubType::SECRET) {
            return $club->members()->where('user_id', $user->id)->exists();
        }

        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Club $club): bool
    {
        return $this->isLeadership($user, $club);
    }

    public function delete(User $user, Club $club): bool
    {
        return $club->owner_id === $user->id;
    }

    public function join(User $user, Club $club): bool
    {
        if ($club->blockedUsers()->where('user_id', $user->id)->exists()) {
            return false;
        }

        return ! $club->members()->where('user_id', $user->id)->exists();
    }

    public function manageMembers(User $user, Club $club): bool
    {
        return $this->isOfficer($user, $club);
    }

    public function manageRoles(User $user, Club $club): bool
    {
        if ($club->owner_id === $user->id) {
            return true;
        }

        $membership = $club->clubMembers()->where('user_id', $user->id)->first();

        return $membership && $membership->role->canManageRoles();
    }

    public function managePosts(User $user, Club $club): bool
    {
        return $this->isOfficer($user, $club);
    }

    public function manageEvents(User $user, Club $club): bool
    {
        return $this->isOfficer($user, $club);
    }

    public function accessChat(User $user, Club $club): bool
    {
        return $club->members()->where('user_id', $user->id)->exists();
    }

    public function manageSettings(User $user, Club $club): bool
    {
        return $this->isLeadership($user, $club);
    }

    private function isLeadership(User $user, Club $club): bool
    {
        return $club->owner_id === $user->id
            || $club->clubMembers()
                ->where('user_id', $user->id)
                ->whereIn('role', [ClubRole::PRESIDENT, ClubRole::VICE_PRESIDENT])
                ->exists();
    }

    private function isOfficer(User $user, Club $club): bool
    {
        if ($club->owner_id === $user->id) {
            return true;
        }

        $membership = $club->clubMembers()->where('user_id', $user->id)->first();

        return $membership && $membership->role->isOfficer();
    }
}
