<?php

namespace App\Enums;

enum ClubRole: string
{
    case PRESIDENT = 'president';
    case VICE_PRESIDENT = 'vice_president';
    case SECRETARY = 'secretary';
    case TREASURER = 'treasurer';
    case ROAD_CAPTAIN = 'road_captain';
    case MODERATOR = 'moderator';
    case MEMBER = 'member';

    public function rank(): int
    {
        return match ($this) {
            self::PRESIDENT => 1,
            self::VICE_PRESIDENT => 2,
            self::SECRETARY, self::TREASURER, self::ROAD_CAPTAIN => 3,
            self::MODERATOR => 4,
            self::MEMBER => 5,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::PRESIDENT => 'President',
            self::VICE_PRESIDENT => 'Vice President',
            self::SECRETARY => 'Secretary',
            self::TREASURER => 'Treasurer',
            self::ROAD_CAPTAIN => 'Road Captain',
            self::MODERATOR => 'Moderator',
            self::MEMBER => 'Member',
        };
    }

    public function outranks(ClubRole $other): bool
    {
        return $this->rank() < $other->rank();
    }

    /**
     * Roles this role can assign (only if canManageRoles() is true).
     *
     * @return ClubRole[]
     */
    public function assignableRoles(): array
    {
        if (! $this->canManageRoles()) {
            return [];
        }

        return array_values(array_filter(
            self::cases(),
            fn (ClubRole $role) => $role->rank() > $this->rank(),
        ));
    }

    public function isOfficer(): bool
    {
        return $this !== self::MEMBER;
    }

    public function canDeletePosts(): bool
    {
        return $this->isOfficer();
    }

    public function canMuteUsers(): bool
    {
        return $this->isOfficer();
    }

    public function canRemoveMembers(): bool
    {
        return in_array($this, [self::PRESIDENT, self::VICE_PRESIDENT, self::MODERATOR]);
    }

    public function canManageRoles(): bool
    {
        return in_array($this, [self::PRESIDENT, self::VICE_PRESIDENT]);
    }

    public function canPinPosts(): bool
    {
        return $this->isOfficer();
    }

    public function canBlockUsers(): bool
    {
        return in_array($this, [self::PRESIDENT, self::VICE_PRESIDENT, self::MODERATOR]);
    }
}
