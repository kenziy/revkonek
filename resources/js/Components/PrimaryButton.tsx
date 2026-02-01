import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={clsx(
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5',
                'text-sm font-semibold text-white',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'active:scale-[0.98]',
                'bg-primary-600 hover:bg-primary-500',
                'dark:bg-primary-500 dark:hover:bg-primary-400',
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
