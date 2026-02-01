import clsx from 'clsx';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'white' | 'secondary';
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    variant = 'primary',
    className,
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
        xl: 'h-12 w-12 border-4',
    };

    const variantClasses = {
        primary: 'border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400',
        white: 'border-white/30 border-t-white',
        secondary: 'border-secondary-200 border-t-secondary-600 dark:border-secondary-700 dark:border-t-secondary-400',
    };

    return (
        <div
            className={clsx(
                'animate-spin rounded-full',
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

interface LoadingOverlayProps {
    message?: string;
}

LoadingSpinner.Overlay = function LoadingOverlay({ message }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm">
            <LoadingSpinner size="xl" />
            {message && (
                <p className="mt-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    {message}
                </p>
            )}
        </div>
    );
};

LoadingSpinner.Inline = function InlineSpinner() {
    return (
        <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
        </div>
    );
};
