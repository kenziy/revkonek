import { Link } from '@inertiajs/react';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Avatar from './Avatar';
import Badge from './Badge';
import ThemeToggle from './ThemeToggle';

interface TopBarProps {
    user?: {
        name: string;
        avatar?: string | null;
    };
    title?: string;
    showLogo?: boolean;
    notificationCount?: number;
    leftAction?: ReactNode;
    rightActions?: ReactNode;
    transparent?: boolean;
}

export default function TopBar({
    user,
    title,
    showLogo = true,
    notificationCount = 0,
    leftAction,
    rightActions,
    transparent = false,
}: TopBarProps) {
    return (
        <header
            className={clsx(
                'fixed top-0 left-0 right-0 z-40',
                'safe-top',
                transparent
                    ? 'bg-transparent'
                    : clsx(
                          'bg-white/95 backdrop-blur-lg border-b border-secondary-200',
                          'dark:bg-secondary-900/95 dark:border-secondary-800'
                      )
            )}
        >
            <div className="flex items-center justify-between h-14 px-4">
                <div className="flex items-center gap-3">
                    {leftAction}
                    {showLogo && !leftAction && (
                        <Link href={route('dashboard')} className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600">
                                <span className="text-white font-bold text-sm">RK</span>
                            </div>
                            <span className="font-bold text-lg text-secondary-900 dark:text-white">
                                REV KONEK
                            </span>
                        </Link>
                    )}
                    {title && !showLogo && (
                        <h1 className="font-semibold text-lg text-secondary-900 dark:text-white">
                            {title}
                        </h1>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {rightActions}

                    <ThemeToggle />

                    <Link
                        href={route('notifications.index')}
                        className={clsx(
                            'relative flex items-center justify-center w-10 h-10 rounded-full',
                            'text-secondary-600 hover:bg-secondary-100',
                            'dark:text-secondary-400 dark:hover:bg-secondary-800',
                            'transition-colors duration-200'
                        )}
                    >
                        <BellIcon className="h-6 w-6" />
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1">
                                <Badge.Count count={notificationCount} variant="danger" />
                            </span>
                        )}
                    </Link>

                    {user && (
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center"
                        >
                            <Avatar
                                src={user.avatar}
                                name={user.name}
                                size="sm"
                                status="online"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
