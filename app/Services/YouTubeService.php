<?php

namespace App\Services;

class YouTubeService
{
    public static function extractVideoId(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $patterns = [
            '/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/',
            '/youtu\.be\/([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    public static function isValidYouTubeUrl(?string $url): bool
    {
        return self::extractVideoId($url) !== null;
    }

    public static function getEmbedUrl(string $videoId, bool $autoplay = false): string
    {
        $params = [
            'enablejsapi' => 1,
            'origin' => config('app.url'),
        ];

        if ($autoplay) {
            $params['autoplay'] = 1;
            $params['mute'] = 1;
        }

        return 'https://www.youtube.com/embed/'.$videoId.'?'.http_build_query($params);
    }
}
