import { InputHTMLAttributes, forwardRef, useState } from 'react';
import clsx from 'clsx';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch?: (value: string) => void;
    onClear?: () => void;
    loading?: boolean;
}

export default forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
    {
        className,
        value,
        onChange,
        onSearch,
        onClear,
        loading = false,
        placeholder = 'Search...',
        ...props
    },
    ref
) {
    const [internalValue, setInternalValue] = useState('');
    const displayValue = value !== undefined ? value : internalValue;
    const hasValue = String(displayValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined) {
            setInternalValue(e.target.value);
        }
        onChange?.(e);
    };

    const handleClear = () => {
        if (value === undefined) {
            setInternalValue('');
        }
        onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(String(displayValue));
        }
    };

    return (
        <div className={clsx('relative', className)}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon
                    className={clsx(
                        'h-5 w-5 transition-colors',
                        hasValue
                            ? 'text-primary-500'
                            : 'text-secondary-400 dark:text-secondary-500'
                    )}
                />
            </div>
            <input
                ref={ref}
                type="search"
                value={displayValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={clsx(
                    'w-full pl-10 pr-10 py-3 rounded-xl',
                    'text-sm transition-colors duration-200',
                    'border border-secondary-200 bg-secondary-50',
                    'text-secondary-900 placeholder:text-secondary-400',
                    'focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
                    'dark:border-secondary-700 dark:bg-secondary-800',
                    'dark:text-secondary-100 dark:placeholder:text-secondary-500',
                    'dark:focus:border-primary-400 dark:focus:bg-secondary-800 dark:focus:ring-primary-400/20'
                )}
                {...props}
            />
            {hasValue && !loading && (
                <button
                    type="button"
                    onClick={handleClear}
                    className={clsx(
                        'absolute inset-y-0 right-0 flex items-center pr-3',
                        'text-secondary-400 hover:text-secondary-600',
                        'dark:text-secondary-500 dark:hover:text-secondary-300',
                        'transition-colors'
                    )}
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            )}
            {loading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
                </div>
            )}
        </div>
    );
});
