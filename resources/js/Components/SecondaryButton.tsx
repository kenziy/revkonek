import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={clsx(
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5',
                'text-sm font-semibold',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2',
                'active:scale-[0.98]',
                'border border-secondary-300 bg-white text-secondary-700',
                'hover:bg-secondary-50',
                'dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-200',
                'dark:hover:bg-secondary-700',
                'dark:focus-visible:ring-offset-secondary-900',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
