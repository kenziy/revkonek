import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, StatCard } from '@/Components/UI';
import {
    UsersIcon,
    UserGroupIcon,
    ShoppingBagIcon,
    CreditCardIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { AdminStats, AdminUser, AuditLog } from '@/types/admin';

interface Props {
    stats: AdminStats;
    recentUsers: AdminUser[];
    recentAuditLogs: AuditLog[];
}

export default function Dashboard({ stats, recentUsers, recentAuditLogs }: Props) {
    return (
        <AdminLayout header="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<UsersIcon className="h-5 w-5" />}
                    change={stats.newUsersThisWeek > 0 ? { value: stats.newUsersThisWeek, type: 'increase' } : undefined}
                />
                <StatCard
                    title="Active Clubs"
                    value={stats.activeClubs}
                    icon={<UserGroupIcon className="h-5 w-5" />}
                />
                <StatCard
                    title="Pending Shop Verifications"
                    value={stats.pendingShopVerifications}
                    icon={<ShoppingBagIcon className="h-5 w-5" />}
                    variant={stats.pendingShopVerifications > 0 ? 'warning' : 'default'}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Active Subscriptions"
                    value={stats.totalSubscriptions}
                    icon={<CreditCardIcon className="h-5 w-5" />}
                    variant="primary"
                />
                <StatCard
                    title="New Users Today"
                    value={stats.newUsersToday}
                    icon={<UsersIcon className="h-5 w-5" />}
                    variant="success"
                />
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers}
                    icon={<ShieldCheckIcon className="h-5 w-5" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="none">
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-secondary-900 dark:text-white">Recent Users</h2>
                            <Link
                                href={route('admin.users.index')}
                                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                                View all
                            </Link>
                        </div>
                    </Card.Header>
                    <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                        {recentUsers.map((user) => (
                            <Link
                                key={user.id}
                                href={route('admin.users.show', user.id)}
                                className="flex items-center justify-between px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                        {user.email}
                                    </p>
                                </div>
                                <Badge variant={user.is_active ? 'success' : 'danger'} size="sm">
                                    {user.is_active ? 'Active' : 'Banned'}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </Card>

                <Card padding="none">
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-secondary-900 dark:text-white">Recent Activity</h2>
                            <Link
                                href={route('admin.audit-logs.index')}
                                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                                View all
                            </Link>
                        </div>
                    </Card.Header>
                    <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                        {recentAuditLogs.map((log) => (
                            <div key={log.id} className="px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                        {log.action.replace(/\./g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </p>
                                    <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {log.user_name && (
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                                        by {log.user_name}
                                    </p>
                                )}
                            </div>
                        ))}
                        {recentAuditLogs.length === 0 && (
                            <p className="px-4 py-6 text-sm text-secondary-500 dark:text-secondary-400 text-center">
                                No recent activity
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
