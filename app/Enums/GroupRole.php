<?php

namespace App\Enums;

enum GroupRole: string
{
    case ADMIN = 'admin';
    case MODERATOR = 'moderator';
    case MEMBER = 'member';

    public function canDeletePosts(): bool
    {
        return in_array($this, [self::ADMIN, self::MODERATOR]);
    }

    public function canMuteUsers(): bool
    {
        return in_array($this, [self::ADMIN, self::MODERATOR]);
    }

    public function canRemoveMembers(): bool
    {
        return $this === self::ADMIN;
    }

    public function canManageRoles(): bool
    {
        return $this === self::ADMIN;
    }

    public function canPinPosts(): bool
    {
        return in_array($this, [self::ADMIN, self::MODERATOR]);
    }
}
