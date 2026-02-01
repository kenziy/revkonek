import { ReactNode, MouseEvent } from 'react';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface ListItemProps {
    leading?: ReactNode;
    title: string;
    subtitle?: string;
    trailing?: ReactNode;
    href?: string;
    showArrow?: boolean;
    disabled?: boolean;
    destructive?: boolean;
    className?: string;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function ListItem({
    leading,
    title,
    subtitle,
    trailing,
    href,
    showArrow = false,
    disabled = false,
    destructive = false,
    className,
    onClick,
}: ListItemProps) {
    const content = (
        <>
            {leading && (
                <div className="flex-shrink-0 mr-3">{leading}</div>
            )}
            <div className="flex-1 min-w-0">
                <p
                    className={clsx(
                        'text-sm font-medium truncate',
                        destructive
                            ? 'text-danger-600 dark:text-danger-400'
                            : 'text-secondary-900 dark:text-white'
                    )}
                >
                    {title}
                </p>
                {subtitle && (
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                        {subtitle}
                    </p>
                )}
            </div>
            {trailing && (
                <div className="flex-shrink-0 ml-3">{trailing}</div>
            )}
            {showArrow && !trailing && (
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 ml-2 text-secondary-400" />
            )}
        </>
    );

    const baseClasses = clsx(
        'flex items-center px-4 py-3 min-h-touch',
        'transition-colors duration-150',
        disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-secondary-50 dark:hover:bg-secondary-800/50 active:bg-secondary-100 dark:active:bg-secondary-800',
        className
    );

    if (href && !disabled) {
        return (
            <Link href={href} className={baseClasses}>
                {content}
            </Link>
        );
    }

    return (
        <div
            className={clsx(baseClasses, onClick && !disabled && 'cursor-pointer')}
            onClick={disabled ? undefined : onClick}
        >
            {content}
        </div>
    );
}

interface ListGroupProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

ListItem.Group = function ListGroup({
    title,
    children,
    className,
}: ListGroupProps) {
    return (
        <div className={className}>
            {title && (
                <h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                    {title}
                </h3>
            )}
            <div className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden divide-y divide-secondary-100 dark:divide-secondary-700">
                {children}
            </div>
        </div>
    );
};
