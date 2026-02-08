import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { ThemeToggle, Avatar, Badge, Alert } from '@/Components/UI';
import {
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    ShoppingBagIcon,
    CreditCardIcon,
    SparklesIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    ClipboardDocumentListIcon,
    ArrowLeftIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
    name: string;
    href: string;
    icon: typeof HomeIcon;
}

export default function AdminLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash } = usePage().props as any;
    const user = auth?.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState<{ variant: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ variant: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ variant: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const dismissToast = useCallback(() => setToast(null), []);

    const navigation: NavItem[] = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
        { name: 'Users', href: route('admin.users.index'), icon: UsersIcon },
        { name: 'Clubs', href: route('admin.clubs.index'), icon: UserGroupIcon },
        { name: 'Shops', href: route('admin.shops.index'), icon: ShoppingBagIcon },
        { name: 'Subscriptions', href: route('admin.subscriptions.index'), icon: CreditCardIcon },
        { name: 'Club Subs', href: route('admin.club-subscriptions.index'), icon: SparklesIcon },
        { name: 'Content', href: route('admin.content.index'), icon: DocumentTextIcon },
        { name: 'Settings', href: route('admin.settings.index'), icon: Cog6ToothIcon },
        { name: 'Audit Logs', href: route('admin.audit-logs.index'), icon: ClipboardDocumentListIcon },
    ];

    const isCurrentRoute = (href: string) => {
        try {
            const url = new URL(href);
            return window.location.pathname.startsWith(url.pathname);
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
                    'bg-secondary-900 dark:bg-secondary-950 border-r border-secondary-800',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-800">
                        <Link href={route('admin.dashboard')} className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600">
                                <span className="text-white font-bold text-sm">RK</span>
                            </div>
                            <span className="font-bold text-lg text-white">
                                REV KONEK
                            </span>
                            <Badge variant="warning" size="sm">ADMIN</Badge>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg text-secondary-400 hover:bg-secondary-800"
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
                                                    ? 'bg-primary-600/20 text-primary-400'
                                                    : 'text-secondary-400 hover:bg-secondary-800 hover:text-secondary-200'
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

                    <div className="border-t border-secondary-800 p-4">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary-400 hover:bg-secondary-800 hover:text-secondary-200 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            Back to App
                        </Link>
                        <div className="flex items-center gap-3 mt-3 px-3">
                            <Avatar
                                src={user?.avatar}
                                name={user?.display_name}
                                size="sm"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.display_name}
                                </p>
                                <p className="text-xs text-secondary-500 truncate">
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
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6">{children}</main>
            </div>

            {/* Toast Notifications */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 max-w-sm">
                    <Alert.Toast
                        variant={toast.variant}
                        message={toast.message}
                        onClose={dismissToast}
                    />
                </div>
            )}
        </div>
    );
}
