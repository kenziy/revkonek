import { Switch as HeadlessSwitch } from '@headlessui/react';
import clsx from 'clsx';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function Switch({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
}: SwitchProps) {
    const sizeClasses = {
        sm: {
            switch: 'h-5 w-9',
            dot: 'h-3 w-3',
            translate: 'translate-x-4',
        },
        md: {
            switch: 'h-6 w-11',
            dot: 'h-4 w-4',
            translate: 'translate-x-5',
        },
        lg: {
            switch: 'h-7 w-14',
            dot: 'h-5 w-5',
            translate: 'translate-x-7',
        },
    };

    const sizes = sizeClasses[size];

    return (
        <HeadlessSwitch.Group>
            <div className="flex items-center justify-between">
                {(label || description) && (
                    <div className="flex-1 mr-3">
                        {label && (
                            <HeadlessSwitch.Label
                                className={clsx(
                                    'text-sm font-medium',
                                    disabled
                                        ? 'text-secondary-400 dark:text-secondary-500'
                                        : 'text-secondary-900 dark:text-white',
                                    'cursor-pointer'
                                )}
                            >
                                {label}
                            </HeadlessSwitch.Label>
                        )}
                        {description && (
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                {description}
                            </p>
                        )}
                    </div>
                )}
                <HeadlessSwitch
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={clsx(
                        'relative inline-flex flex-shrink-0 rounded-full',
                        'transition-colors duration-200 ease-in-out',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                        'dark:focus-visible:ring-offset-secondary-900',
                        sizes.switch,
                        checked
                            ? 'bg-primary-600 dark:bg-primary-500'
                            : 'bg-secondary-200 dark:bg-secondary-700',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <span
                        className={clsx(
                            'inline-block rounded-full bg-white shadow-sm',
                            'transform transition duration-200 ease-in-out',
                            sizes.dot,
                            'mt-1 ml-1',
                            checked ? sizes.translate : 'translate-x-0'
                        )}
                    />
                </HeadlessSwitch>
            </div>
        </HeadlessSwitch.Group>
    );
}
