import clsx from 'clsx';

interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
    animated?: boolean;
    className?: string;
}

export default function ProgressBar({
    value,
    max = 100,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    label,
    animated = false,
    className,
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const variantClasses = {
        primary: 'bg-primary-600 dark:bg-primary-500',
        success: 'bg-success-600 dark:bg-success-500',
        warning: 'bg-accent-500',
        danger: 'bg-danger-600 dark:bg-danger-500',
    };

    return (
        <div className={className}>
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        {label}
                    </span>
                    {showLabel && (
                        <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div
                className={clsx(
                    'w-full rounded-full overflow-hidden',
                    'bg-secondary-200 dark:bg-secondary-700',
                    sizeClasses[size]
                )}
            >
                <div
                    className={clsx(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        variantClasses[variant],
                        animated && 'animate-pulse-soft'
                    )}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    );
}

interface StepsProgressProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

ProgressBar.Steps = function StepsProgress({
    currentStep,
    totalSteps,
    className,
}: StepsProgressProps) {
    return (
        <div className={clsx('flex gap-1.5', className)}>
            {Array.from({ length: totalSteps }, (_, i) => (
                <div
                    key={i}
                    className={clsx(
                        'flex-1 h-1 rounded-full transition-colors duration-300',
                        i < currentStep
                            ? 'bg-primary-600 dark:bg-primary-500'
                            : 'bg-secondary-200 dark:bg-secondary-700'
                    )}
                />
            ))}
        </div>
    );
};
