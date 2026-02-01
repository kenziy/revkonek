import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={clsx(
                'h-5 w-5 rounded border-2 transition-colors duration-200',
                'border-secondary-300 text-primary-600',
                'focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0',
                'dark:border-secondary-600 dark:bg-secondary-800',
                'dark:text-primary-500 dark:checked:bg-primary-500',
                'dark:focus:ring-primary-400/20',
                className
            )}
        />
    );
}
