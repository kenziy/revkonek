import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, EmptyState, Badge, Avatar } from '@/Components/UI';
import clsx from 'clsx';
import {
    BellIcon,
    BoltIcon,
    UserGroupIcon,
    TrophyIcon,
    ChatBubbleLeftRightIcon,
    ShieldExclamationIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';
import SecondaryButton from '@/Components/SecondaryButton';

interface Notification {
    id: string;
    type: 'challenge' | 'group' | 'win' | 'message' | 'sos' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    data?: {
        link?: string;
        avatar?: string;
    };
}

interface NotificationsIndexProps {
    notifications?: Notification[];
    unreadCount?: number;
}

export default function NotificationsIndex({
    notifications = [],
    unreadCount = 0,
}: NotificationsIndexProps) {
    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'challenge':
                return <BoltIcon className="h-5 w-5" />;
            case 'group':
                return <UserGroupIcon className="h-5 w-5" />;
            case 'win':
                return <TrophyIcon className="h-5 w-5" />;
            case 'message':
                return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
            case 'sos':
                return <ShieldExclamationIcon className="h-5 w-5" />;
            default:
                return <BellIcon className="h-5 w-5" />;
        }
    };

    const getIconBg = (type: Notification['type']) => {
        switch (type) {
            case 'challenge':
                return 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400';
            case 'group':
                return 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400';
            case 'win':
                return 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400';
            case 'message':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'sos':
                return 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400';
            default:
                return 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400';
        }
    };

    const markAllAsRead = () => {
        router.post(route('notifications.markAllRead'));
    };

    const markAsRead = (id: string) => {
        router.post(route('notifications.markRead', id));
    };

    return (
        <AuthenticatedLayout header="Notifications">
            <Head title="Notifications" />

            <div className="space-y-4">
                {unreadCount > 0 && (
                    <div className="flex items-center justify-between">
                        <Badge variant="primary">
                            {unreadCount} unread
                        </Badge>
                        <SecondaryButton
                            onClick={markAllAsRead}
                            className="text-xs"
                        >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Mark all as read
                        </SecondaryButton>
                    </div>
                )}

                {notifications.length > 0 ? (
                    <Card padding="none">
                        <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => {
                                        if (!notification.read) {
                                            markAsRead(notification.id);
                                        }
                                        if (notification.data?.link) {
                                            router.visit(notification.data.link);
                                        }
                                    }}
                                    className={clsx(
                                        'flex items-start gap-3 p-4 cursor-pointer transition-colors',
                                        !notification.read && 'bg-primary-50/50 dark:bg-primary-900/10',
                                        'hover:bg-secondary-50 dark:hover:bg-secondary-800/50'
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                                            getIconBg(notification.type)
                                        )}
                                    >
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p
                                                className={clsx(
                                                    'text-sm',
                                                    !notification.read
                                                        ? 'font-semibold text-secondary-900 dark:text-white'
                                                        : 'font-medium text-secondary-700 dark:text-secondary-300'
                                                )}
                                            >
                                                {notification.title}
                                            </p>
                                            {!notification.read && (
                                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-secondary-400 mt-1">
                                            {notification.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : (
                    <Card>
                        <EmptyState
                            icon={<BellIcon className="h-8 w-8" />}
                            title="No notifications"
                            description="You're all caught up! Check back later for updates."
                        />
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
