import clsx from 'clsx';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface ProBadgeProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
};

export default function ProBadge({ size = 'md', className }: ProBadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center gap-0.5 font-semibold text-amber-500',
                textSizes[size],
                className,
            )}
            title="Pro Member"
        >
            <CheckBadgeIcon className={clsx(sizeClasses[size], 'text-amber-500')} />
            <span>PRO</span>
        </span>
    );
}
