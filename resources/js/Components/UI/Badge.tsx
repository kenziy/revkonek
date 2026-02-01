import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    size?: 'sm' | 'md' | 'lg';
    rounded?: 'full' | 'md';
    dot?: boolean;
}

export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    rounded = 'full',
    dot = false,
    className,
    ...props
}: BadgeProps) {
    const variantClasses = {
        primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400',
        secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300',
        success: 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-400',
        danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-400',
        warning: 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-400',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    };

    const dotColors = {
        primary: 'bg-primary-500',
        secondary: 'bg-secondary-500',
        success: 'bg-success-500',
        danger: 'bg-danger-500',
        warning: 'bg-accent-500',
        info: 'bg-blue-500',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    const roundedClasses = {
        full: 'rounded-full',
        md: 'rounded-md',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 font-medium',
                variantClasses[variant],
                sizeClasses[size],
                roundedClasses[rounded],
                className
            )}
            {...props}
        >
            {dot && (
                <span
                    className={clsx('h-1.5 w-1.5 rounded-full', dotColors[variant])}
                />
            )}
            {children}
        </span>
    );
}

interface CountBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    count: number;
    max?: number;
    variant?: 'primary' | 'danger';
}

Badge.Count = function CountBadge({
    count,
    max = 99,
    variant = 'primary',
    className,
    ...props
}: CountBadgeProps) {
    if (count <= 0) return null;

    const displayCount = count > max ? `${max}+` : count.toString();

    const variantClasses = {
        primary: 'bg-primary-500 text-white',
        danger: 'bg-danger-500 text-white',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5',
                'text-xs font-bold rounded-full',
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {displayCount}
        </span>
    );
};
