import { ReactNode } from 'react';
import clsx from 'clsx';
import {
    InboxIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    DocumentIcon,
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';

type IconKey = 'inbox' | 'search' | 'error' | 'document';
type EmptyStateIcon = IconKey | ReactNode;

interface EmptyStateProps {
    icon?: EmptyStateIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const iconMap: Record<IconKey, typeof InboxIcon> = {
    inbox: InboxIcon,
    search: MagnifyingGlassIcon,
    error: ExclamationTriangleIcon,
    document: DocumentIcon,
};

function isIconKey(icon: EmptyStateIcon): icon is IconKey {
    return typeof icon === 'string' && icon in iconMap;
}

export default function EmptyState({
    icon = 'inbox',
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    const IconComponent = isIconKey(icon) ? iconMap[icon] : null;

    return (
        <div
            className={clsx(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >
            <div
                className={clsx(
                    'flex items-center justify-center w-16 h-16 rounded-full mb-4',
                    'bg-secondary-100 dark:bg-secondary-800'
                )}
            >
                {IconComponent ? (
                    <IconComponent className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />
                ) : (
                    icon
                )}
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-sm mb-6">
                    {description}
                </p>
            )}
            {action && (
                <PrimaryButton onClick={action.onClick}>{action.label}</PrimaryButton>
            )}
        </div>
    );
}
