import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { PlusIcon } from '@heroicons/react/24/solid';

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    variant?: 'primary' | 'danger' | 'secondary';
    size?: 'md' | 'lg';
    position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
    label?: string;
}

export default function FloatingActionButton({
    icon,
    variant = 'primary',
    size = 'md',
    position = 'bottom-right',
    label,
    className,
    ...props
}: FloatingActionButtonProps) {
    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/30',
        danger: 'bg-danger-600 hover:bg-danger-500 text-white shadow-lg shadow-danger-500/30',
        secondary: 'bg-secondary-700 hover:bg-secondary-600 text-white shadow-lg dark:bg-secondary-600 dark:hover:bg-secondary-500',
    };

    const sizeClasses = {
        md: 'w-14 h-14',
        lg: 'w-16 h-16',
    };

    const iconSizes = {
        md: 'h-6 w-6',
        lg: 'h-7 w-7',
    };

    const positionClasses = {
        'bottom-right': 'bottom-20 right-4',
        'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
        'bottom-left': 'bottom-20 left-4',
    };

    return (
        <button
            className={clsx(
                'fixed z-30 flex items-center justify-center rounded-full',
                'transition-all duration-200',
                'active:scale-95',
                'focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50',
                variantClasses[variant],
                sizeClasses[size],
                positionClasses[position],
                label && 'gap-2 px-5 w-auto',
                className
            )}
            aria-label={label || 'Action button'}
            {...props}
        >
            {icon || <PlusIcon className={iconSizes[size]} />}
            {label && <span className="font-semibold text-sm">{label}</span>}
        </button>
    );
}
