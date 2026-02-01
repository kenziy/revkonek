import { ReactNode, useState, useEffect } from 'react';
import clsx from 'clsx';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
    icon?: ReactNode;
}

const variantConfig = {
    success: {
        icon: CheckCircleIcon,
        classes: 'bg-success-50 border-success-200 text-success-800 dark:bg-success-900/20 dark:border-success-800 dark:text-success-300',
        iconClass: 'text-success-500',
    },
    error: {
        icon: XCircleIcon,
        classes: 'bg-danger-50 border-danger-200 text-danger-800 dark:bg-danger-900/20 dark:border-danger-800 dark:text-danger-300',
        iconClass: 'text-danger-500',
    },
    warning: {
        icon: ExclamationTriangleIcon,
        classes: 'bg-accent-50 border-accent-200 text-accent-800 dark:bg-accent-900/20 dark:border-accent-800 dark:text-accent-300',
        iconClass: 'text-accent-500',
    },
    info: {
        icon: InformationCircleIcon,
        classes: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        iconClass: 'text-blue-500',
    },
};

export default function Alert({
    variant = 'info',
    title,
    children,
    dismissible = false,
    onDismiss,
    className,
    icon,
}: AlertProps) {
    const [isVisible, setIsVisible] = useState(true);
    const config = variantConfig[variant];
    const Icon = config.icon;

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) return null;

    return (
        <div
            className={clsx(
                'flex items-start gap-3 p-4 rounded-lg border',
                config.classes,
                className
            )}
            role="alert"
        >
            <div className="flex-shrink-0">
                {icon || <Icon className={clsx('h-5 w-5', config.iconClass)} />}
            </div>
            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className="font-semibold mb-1">{title}</h4>
                )}
                <div className="text-sm">{children}</div>
            </div>
            {dismissible && (
                <button
                    onClick={handleDismiss}
                    className={clsx(
                        'flex-shrink-0 p-1 rounded-md',
                        'hover:bg-black/10 dark:hover:bg-white/10',
                        'transition-colors duration-200'
                    )}
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}

interface ToastProps {
    variant?: AlertVariant;
    message: string;
    duration?: number;
    onClose: () => void;
}

Alert.Toast = function Toast({
    variant = 'info',
    message,
    duration = 5000,
    onClose,
}: ToastProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div
            className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg shadow-soft-lg animate-slide-up',
                'bg-white dark:bg-secondary-800',
                'border border-secondary-200 dark:border-secondary-700'
            )}
        >
            <Icon className={clsx('h-5 w-5 flex-shrink-0', config.iconClass)} />
            <p className="text-sm font-medium text-secondary-900 dark:text-white flex-1">
                {message}
            </p>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
                <XMarkIcon className="h-4 w-4 text-secondary-500" />
            </button>
        </div>
    );
};
