import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
    rounded?: 'full' | 'lg' | 'md';
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function getColorFromName(name: string): string {
    const colors = [
        'bg-primary-500',
        'bg-accent-500',
        'bg-success-500',
        'bg-secondary-500',
        'bg-primary-600',
        'bg-accent-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

export default function Avatar({
    src,
    alt = '',
    name = '',
    size = 'md',
    status,
    rounded = 'full',
    className,
    ...props
}: AvatarProps) {
    const sizeClasses = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
    };

    const roundedClasses = {
        full: 'rounded-full',
        lg: 'rounded-lg',
        md: 'rounded-md',
    };

    const statusSizeClasses = {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
    };

    const statusColors = {
        online: 'bg-success-500',
        offline: 'bg-secondary-400',
        away: 'bg-accent-500',
        busy: 'bg-danger-500',
    };

    return (
        <div className={clsx('relative inline-flex', className)} {...props}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className={clsx(
                        'object-cover',
                        sizeClasses[size],
                        roundedClasses[rounded],
                        'ring-2 ring-white dark:ring-secondary-800'
                    )}
                />
            ) : (
                <div
                    className={clsx(
                        'flex items-center justify-center font-semibold text-white',
                        sizeClasses[size],
                        roundedClasses[rounded],
                        name ? getColorFromName(name) : 'bg-secondary-400'
                    )}
                >
                    {name ? getInitials(name) : '?'}
                </div>
            )}
            {status && (
                <span
                    className={clsx(
                        'absolute bottom-0 right-0 block rounded-full ring-2',
                        'ring-white dark:ring-secondary-800',
                        statusSizeClasses[size],
                        statusColors[status]
                    )}
                />
            )}
        </div>
    );
}

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
    max?: number;
    children: React.ReactNode;
}

Avatar.Group = function AvatarGroup({
    max = 4,
    children,
    className,
    ...props
}: AvatarGroupProps) {
    const childArray = Array.isArray(children) ? children : [children];
    const visibleAvatars = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
        <div className={clsx('flex -space-x-2', className)} {...props}>
            {visibleAvatars}
            {remainingCount > 0 && (
                <div
                    className={clsx(
                        'flex items-center justify-center h-10 w-10 rounded-full',
                        'bg-secondary-200 dark:bg-secondary-700',
                        'text-sm font-semibold',
                        'text-secondary-600 dark:text-secondary-300',
                        'ring-2 ring-white dark:ring-secondary-800'
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};
