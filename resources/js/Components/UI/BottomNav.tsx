import { Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { ReactNode } from 'react';
import {
    HomeIcon,
    UserGroupIcon,
    UserIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    UserGroupIcon as UserGroupIconSolid,
    UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
    name: string;
    href: string;
    icon: ReactNode;
    iconActive: ReactNode;
    badge?: number;
}

interface BottomNavProps {
    currentRoute: string;
}

export default function BottomNav({ currentRoute }: BottomNavProps) {
    const navItems: NavItem[] = [
        {
            name: 'Home',
            href: route('dashboard'),
            icon: <HomeIcon className="h-6 w-6" />,
            iconActive: <HomeIconSolid className="h-6 w-6" />,
        },
        {
            name: 'Clubs',
            href: route('clubs.index'),
            icon: <UserGroupIcon className="h-6 w-6" />,
            iconActive: <UserGroupIconSolid className="h-6 w-6" />,
        },
        {
            name: 'Vehicles',
            href: route('vehicles.index'),
            icon: <TruckIcon className="h-6 w-6" />,
            iconActive: <TruckIcon className="h-6 w-6" />,
        },
        {
            name: 'Profile',
            href: route('profile.edit'),
            icon: <UserIcon className="h-6 w-6" />,
            iconActive: <UserIconSolid className="h-6 w-6" />,
        },
    ];

    const isActive = (href: string) => {
        return currentRoute === href || window.location.pathname === new URL(href).pathname;
    };

    return (
        <nav
            className={clsx(
                'fixed bottom-0 left-0 right-0 z-40',
                'bg-white/95 backdrop-blur-lg border-t border-secondary-200',
                'dark:bg-secondary-900/95 dark:border-secondary-800',
                'safe-bottom'
            )}
        >
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'flex flex-col items-center justify-center min-w-touch py-1',
                                'transition-colors duration-200',
                                active
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-secondary-500 dark:text-secondary-400'
                            )}
                        >
                            <span className="relative">
                                {active ? item.iconActive : item.icon}
                                {item.badge && item.badge > 0 && (
                                    <span
                                        className={clsx(
                                            'absolute -top-1 -right-1 flex items-center justify-center',
                                            'min-w-[1rem] h-4 px-1 rounded-full',
                                            'bg-primary-500 text-white text-[10px] font-bold'
                                        )}
                                    >
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </span>
                            <span className="text-[10px] font-medium mt-0.5">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
