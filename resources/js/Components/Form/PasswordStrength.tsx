import { useMemo } from 'react';
import clsx from 'clsx';

interface PasswordStrengthProps {
    password: string;
    showRequirements?: boolean;
    className?: string;
}

interface PasswordRequirement {
    label: string;
    test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'Contains number', test: (p) => /\d/.test(p) },
    { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function calculateStrength(password: string): number {
    if (!password) return 0;
    return requirements.filter((req) => req.test(password)).length;
}

function getStrengthLabel(strength: number): string {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
}

function getStrengthColor(strength: number): string {
    if (strength <= 2) return 'bg-danger-500';
    if (strength <= 3) return 'bg-accent-500';
    if (strength <= 4) return 'bg-success-400';
    return 'bg-success-500';
}

export default function PasswordStrength({
    password,
    showRequirements = true,
    className,
}: PasswordStrengthProps) {
    const strength = useMemo(() => calculateStrength(password), [password]);
    const strengthLabel = getStrengthLabel(strength);
    const strengthColor = getStrengthColor(strength);

    if (!password) return null;

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
                    Password strength
                </span>
                <span
                    className={clsx(
                        'text-xs font-semibold',
                        strength <= 2 && 'text-danger-600 dark:text-danger-400',
                        strength === 3 && 'text-accent-600 dark:text-accent-400',
                        strength >= 4 && 'text-success-600 dark:text-success-400'
                    )}
                >
                    {strengthLabel}
                </span>
            </div>

            <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'h-1.5 flex-1 rounded-full transition-colors duration-300',
                            i < strength
                                ? strengthColor
                                : 'bg-secondary-200 dark:bg-secondary-700'
                        )}
                    />
                ))}
            </div>

            {showRequirements && (
                <ul className="mt-3 space-y-1.5">
                    {requirements.map((req, index) => {
                        const passed = req.test(password);
                        return (
                            <li
                                key={index}
                                className={clsx(
                                    'flex items-center gap-2 text-xs',
                                    passed
                                        ? 'text-success-600 dark:text-success-400'
                                        : 'text-secondary-500 dark:text-secondary-400'
                                )}
                            >
                                <span
                                    className={clsx(
                                        'h-1.5 w-1.5 rounded-full',
                                        passed
                                            ? 'bg-success-500'
                                            : 'bg-secondary-300 dark:bg-secondary-600'
                                    )}
                                />
                                {req.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
