import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import clsx from 'clsx';
import Dropdown from '@/Components/Dropdown';
import { ThemeToggle, Avatar, Badge } from '@/Components/UI';
import {
    HomeIcon,
    BoltIcon,
    UserGroupIcon,
    ShoppingBagIcon,
    BellIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    WrenchScrewdriverIcon,
    ShieldExclamationIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
    name: string;
    href: string;
    icon: typeof HomeIcon;
    current?: boolean;
}

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation: NavItem[] = [
        { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
        { name: 'Match', href: route('match.index'), icon: MagnifyingGlassIcon },
        { name: 'Challenges', href: route('challenges.index'), icon: BoltIcon },
        { name: 'Groups', href: route('groups.index'), icon: UserGroupIcon },
        { name: 'Garage', href: route('garage.index'), icon: WrenchScrewdriverIcon },
        { name: 'Shop', href: route('shop.index'), icon: ShoppingBagIcon },
        { name: 'SOS', href: route('sos.index'), icon: ShieldExclamationIcon },
    ];

    const isCurrentRoute = (href: string) => {
        try {
            const url = new URL(href);
            return window.location.pathname === url.pathname;
        } catch {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={clsx(
                    'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0',
                    'bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-200 dark:border-secondary-700">
                        <Link href={route('dashboard')} className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600">
                                <span className="text-white font-bold text-sm">RK</span>
                            </div>
                            <span className="font-bold text-lg text-secondary-900 dark:text-white">
                                REV KONEK
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <ul className="space-y-1">
                            {navigation.map((item) => {
                                const current = isCurrentRoute(item.href);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={clsx(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors',
                                                current
                                                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                                    : 'text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700/50'
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="border-t border-secondary-200 dark:border-secondary-700 p-4">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={user?.avatar}
                                name={user?.name}
                                size="md"
                                status="online"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header
                    className={clsx(
                        'sticky top-0 z-30 h-16',
                        'bg-white/95 dark:bg-secondary-800/95 backdrop-blur-lg',
                        'border-b border-secondary-200 dark:border-secondary-700'
                    )}
                >
                    <div className="flex h-full items-center justify-between px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                            >
                                <Bars3Icon className="h-6 w-6" />
                            </button>
                            {header && (
                                <h1 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                    {header}
                                </h1>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />

                            <Link
                                href={route('notifications.index')}
                                className={clsx(
                                    'relative flex items-center justify-center w-10 h-10 rounded-full',
                                    'text-secondary-500 hover:bg-secondary-100',
                                    'dark:text-secondary-400 dark:hover:bg-secondary-700',
                                    'transition-colors duration-200'
                                )}
                            >
                                <BellIcon className="h-5 w-5" />
                            </Link>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                                        <Avatar
                                            src={user?.avatar}
                                            name={user?.name}
                                            size="sm"
                                            status="online"
                                        />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content width="56">
                                    <div className="px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
                                        <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <span className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4" />
                                            Profile
                                        </span>
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <span className="flex items-center gap-2">
                                            <Cog6ToothIcon className="h-4 w-4" />
                                            Settings
                                        </span>
                                    </Dropdown.Link>
                                    <div className="border-t border-secondary-100 dark:border-secondary-700">
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            <span className="flex items-center gap-2 text-danger-600 dark:text-danger-400">
                                                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                                                Log Out
                                            </span>
                                        </Dropdown.Link>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
