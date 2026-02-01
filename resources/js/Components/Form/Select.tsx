import { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
    value: string | number;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    options: Option[];
    placeholder?: string;
    error?: boolean;
}

export default forwardRef<HTMLSelectElement, SelectProps>(function Select(
    {
        options,
        placeholder,
        error = false,
        className,
        ...props
    },
    ref
) {
    return (
        <div className="relative">
            <select
                ref={ref}
                className={clsx(
                    'w-full appearance-none rounded-lg border px-4 py-3 pr-10 text-sm',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2',
                    error
                        ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                        : [
                              'border-secondary-300 bg-white text-secondary-900',
                              'focus:border-primary-500 focus:ring-primary-500/20',
                              'dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100',
                              'dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
                          ],
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-secondary-400" />
            </div>
        </div>
    );
});
