<?php

namespace App\Enums;

enum SocialPlatform: string
{
    case YOUTUBE = 'youtube';
    case INSTAGRAM = 'instagram';
    case TIKTOK = 'tiktok';
    case FACEBOOK = 'facebook';
    case TWITTER = 'twitter';
    case WEBSITE = 'website';

    public function label(): string
    {
        return match ($this) {
            self::YOUTUBE => 'YouTube',
            self::INSTAGRAM => 'Instagram',
            self::TIKTOK => 'TikTok',
            self::FACEBOOK => 'Facebook',
            self::TWITTER => 'X / Twitter',
            self::WEBSITE => 'Website',
        };
    }
}
