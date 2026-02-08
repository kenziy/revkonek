import { useState } from 'react';
import clsx from 'clsx';
import { BookOpenIcon } from '@heroicons/react/24/outline';

interface VehicleStoryProps {
    story: string;
    className?: string;
}

export default function VehicleStory({ story, className }: VehicleStoryProps) {
    const [expanded, setExpanded] = useState(false);
    const truncateLength = 300;
    const shouldTruncate = story.length > truncateLength;

    return (
        <div className={className}>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2 mb-3">
                <BookOpenIcon className="h-5 w-5" />
                Build Story
            </h3>
            <div className="prose prose-secondary dark:prose-invert max-w-none">
                <p className="text-secondary-700 dark:text-secondary-300 whitespace-pre-wrap leading-relaxed">
                    {shouldTruncate && !expanded
                        ? story.slice(0, truncateLength) + '...'
                        : story}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline mt-1"
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>
        </div>
    );
}
