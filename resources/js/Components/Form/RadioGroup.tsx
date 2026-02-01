import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Option {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

interface RadioGroupProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    label?: string;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'default' | 'cards';
}

export default function RadioGroup({
    value,
    onChange,
    options,
    label,
    orientation = 'vertical',
    variant = 'default',
}: RadioGroupProps) {
    return (
        <HeadlessRadioGroup value={value} onChange={onChange}>
            {label && (
                <HeadlessRadioGroup.Label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                    {label}
                </HeadlessRadioGroup.Label>
            )}
            <div
                className={clsx(
                    'gap-3',
                    orientation === 'horizontal' ? 'flex flex-wrap' : 'flex flex-col'
                )}
            >
                {options.map((option) => (
                    <HeadlessRadioGroup.Option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className={({ active, checked }) =>
                            clsx(
                                'relative flex cursor-pointer focus:outline-none',
                                variant === 'cards' && [
                                    'rounded-lg border p-4',
                                    'transition-all duration-200',
                                    checked
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-secondary-200 dark:border-secondary-700',
                                    active && 'ring-2 ring-primary-500',
                                    option.disabled && 'opacity-50 cursor-not-allowed',
                                ],
                                variant === 'default' && [
                                    'items-center gap-3',
                                    option.disabled && 'opacity-50 cursor-not-allowed',
                                ]
                            )
                        }
                    >
                        {({ checked }) => (
                            <>
                                {variant === 'default' && (
                                    <span
                                        className={clsx(
                                            'flex h-5 w-5 items-center justify-center rounded-full border-2',
                                            'transition-colors duration-200',
                                            checked
                                                ? 'border-primary-600 bg-primary-600 dark:border-primary-500 dark:bg-primary-500'
                                                : 'border-secondary-300 dark:border-secondary-600'
                                        )}
                                    >
                                        {checked && (
                                            <span className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </span>
                                )}
                                <div className="flex-1">
                                    <HeadlessRadioGroup.Label
                                        as="span"
                                        className={clsx(
                                            'text-sm font-medium',
                                            checked
                                                ? 'text-primary-900 dark:text-primary-100'
                                                : 'text-secondary-900 dark:text-white'
                                        )}
                                    >
                                        {option.label}
                                    </HeadlessRadioGroup.Label>
                                    {option.description && (
                                        <HeadlessRadioGroup.Description
                                            as="span"
                                            className="block text-sm text-secondary-500 dark:text-secondary-400"
                                        >
                                            {option.description}
                                        </HeadlessRadioGroup.Description>
                                    )}
                                </div>
                                {variant === 'cards' && checked && (
                                    <CheckCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                )}
                            </>
                        )}
                    </HeadlessRadioGroup.Option>
                ))}
            </div>
        </HeadlessRadioGroup>
    );
}
