import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'bordered' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

export default function Card({
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    className,
    ...props
}: CardProps) {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const variantClasses = {
        default: clsx(
            'bg-white border border-secondary-100',
            'dark:bg-secondary-800 dark:border-secondary-700'
        ),
        bordered: clsx(
            'bg-transparent border-2 border-secondary-200',
            'dark:border-secondary-600'
        ),
        elevated: clsx(
            'bg-white shadow-soft-lg',
            'dark:bg-secondary-800'
        ),
    };

    return (
        <div
            className={clsx(
                'rounded-xl transition-all duration-200',
                variantClasses[variant],
                paddingClasses[padding],
                hoverable && 'hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

Card.Header = function CardHeader({ children, className, ...props }: CardHeaderProps) {
    return (
        <div
            className={clsx(
                'px-4 py-3 border-b',
                'border-secondary-100 dark:border-secondary-700',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

Card.Body = function CardBody({ children, className, ...props }: CardHeaderProps) {
    return (
        <div className={clsx('p-4', className)} {...props}>
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({ children, className, ...props }: CardHeaderProps) {
    return (
        <div
            className={clsx(
                'px-4 py-3 border-t',
                'border-secondary-100 dark:border-secondary-700',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
