import { useState } from 'react';
import clsx from 'clsx';
import { PlayIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';

interface YouTubePlayerProps {
    videoId: string;
    autoplay?: boolean;
    className?: string;
}

export default function YouTubePlayer({ videoId, autoplay = false, className }: YouTubePlayerProps) {
    const [playing, setPlaying] = useState(autoplay);

    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1${playing ? '&autoplay=1&mute=1' : ''}`;

    if (!playing) {
        return (
            <div className={clsx('relative', className)}>
                <button
                    onClick={() => setPlaying(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                >
                    <MusicalNoteIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Play Background Music</span>
                    <PlayIcon className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <div className={clsx('relative', className)}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary-100 dark:bg-secondary-800">
                <MusicalNoteIcon className="h-4 w-4 text-primary-500 animate-pulse" />
                <span className="text-xs text-secondary-600 dark:text-secondary-400">Now Playing</span>
            </div>
            <iframe
                src={embedUrl}
                className="hidden"
                allow="autoplay; encrypted-media"
                title="Background music"
            />
        </div>
    );
}
