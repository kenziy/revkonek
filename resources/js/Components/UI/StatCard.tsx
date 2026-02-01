import { ReactNode } from 'react';
import clsx from 'clsx';
import {
    ArrowUpIcon,
    ArrowDownIcon,
} from '@heroicons/react/24/solid';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    change?: {
        value: number;
        type: 'increase' | 'decrease';
    };
    variant?: 'default' | 'primary' | 'success' | 'warning';
    className?: string;
}

export default function StatCard({
    title,
    value,
    icon,
    change,
    variant = 'default',
    className,
}: StatCardProps) {
    const variantClasses = {
        default: 'bg-white dark:bg-secondary-800',
        primary: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white',
        success: 'bg-gradient-to-br from-success-600 to-success-700 text-white',
        warning: 'bg-gradient-to-br from-accent-500 to-accent-600 text-white',
    };

    const iconBgClasses = {
        default: 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300',
        primary: 'bg-white/20 text-white',
        success: 'bg-white/20 text-white',
        warning: 'bg-white/20 text-white',
    };

    const titleClasses = {
        default: 'text-secondary-500 dark:text-secondary-400',
        primary: 'text-white/80',
        success: 'text-white/80',
        warning: 'text-white/80',
    };

    const valueClasses = {
        default: 'text-secondary-900 dark:text-white',
        primary: 'text-white',
        success: 'text-white',
        warning: 'text-white',
    };

    return (
        <div
            className={clsx(
                'rounded-xl p-4 shadow-soft',
                'border border-secondary-100 dark:border-secondary-700',
                variantClasses[variant],
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className={clsx('text-sm font-medium', titleClasses[variant])}>
                        {title}
                    </p>
                    <p className={clsx('text-2xl font-bold mt-1', valueClasses[variant])}>
                        {value}
                    </p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            {change.type === 'increase' ? (
                                <ArrowUpIcon className="h-3 w-3 text-success-500" />
                            ) : (
                                <ArrowDownIcon className="h-3 w-3 text-danger-500" />
                            )}
                            <span
                                className={clsx(
                                    'text-xs font-medium',
                                    change.type === 'increase'
                                        ? 'text-success-500'
                                        : 'text-danger-500'
                                )}
                            >
                                {change.value}%
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div
                        className={clsx(
                            'flex items-center justify-center w-10 h-10 rounded-lg',
                            iconBgClasses[variant]
                        )}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
