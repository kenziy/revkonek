import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function DangerButton({
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
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-2',
                'active:scale-[0.98]',
                'bg-danger-600 hover:bg-danger-500 active:bg-danger-700',
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
