import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, StatCard, SearchBar } from '@/Components/UI';
import Pagination from '@/Components/Admin/Pagination';
import Select from '@/Components/Form/Select';
import { CreditCardIcon, XCircleIcon, ClockIcon, CheckCircleIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';
import { AdminSubscription, AdminSubscriptionStats, PaginatedData } from '@/types/admin';

interface Props {
    stats: AdminSubscriptionStats;
    subscriptions: PaginatedData<AdminSubscription>;
    filters: {
        status?: string;
        search?: string;
    };
}

const statusVariants: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'secondary'> = {
    active: 'success',
    cancelled: 'danger',
    expired: 'secondary',
    past_due: 'warning',
    trialing: 'primary',
    pending_verification: 'warning',
    rejected: 'danger',
};

const statusLabels: Record<string, string> = {
    active: 'Active',
    cancelled: 'Cancelled',
    expired: 'Expired',
    past_due: 'Past Due',
    trialing: 'Trialing',
    pending_verification: 'Pending',
    rejected: 'Rejected',
};

export default function SubscriptionsIndex({ stats, subscriptions, filters }: Props) {
    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.subscriptions.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout header="Subscriptions">
            <Head title="Admin - Subscriptions" />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                <StatCard
                    title="Active"
                    value={stats.totalActive}
                    icon={<CheckCircleIcon className="h-5 w-5" />}
                    variant="success"
                />
                <StatCard
                    title="Pending"
                    value={stats.totalPending}
                    icon={<ClockIcon className="h-5 w-5" />}
                    variant="warning"
                />
                <StatCard
                    title="Trialing"
                    value={stats.totalTrialing}
                    icon={<ClockIcon className="h-5 w-5" />}
                    variant="primary"
                />
                <StatCard
                    title="Rejected"
                    value={stats.totalRejected}
                    icon={<XCircleIcon className="h-5 w-5" />}
                    variant="danger"
                />
                <StatCard
                    title="Cancelled"
                    value={stats.totalCancelled}
                    icon={<XCircleIcon className="h-5 w-5" />}
                />
                <StatCard
                    title="Expired"
                    value={stats.totalExpired}
                    icon={<CreditCardIcon className="h-5 w-5" />}
                />
                <StatCard
                    title="Revenue"
                    value={`₱${Number(stats.totalRevenue).toLocaleString()}`}
                    icon={<CurrencyDollarIcon className="h-5 w-5" />}
                    variant="success"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <SearchBar
                        value={filters.search || ''}
                        onChange={(e) => handleFilter('search', e.target.value)}
                        placeholder="Search users..."
                    />
                    <Select
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'active', label: 'Active' },
                            { value: 'pending_verification', label: 'Pending' },
                            { value: 'rejected', label: 'Rejected' },
                            { value: 'cancelled', label: 'Cancelled' },
                            { value: 'expired', label: 'Expired' },
                            { value: 'trialing', label: 'Trialing' },
                        ]}
                        value={filters.status || ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route('admin.subscriptions.coupons')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                    >
                        <TicketIcon className="h-4 w-4" />
                        Coupons
                    </Link>
                    <Link
                        href={route('admin.subscriptions.plans')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <CurrencyDollarIcon className="h-4 w-4" />
                        Manage Plans
                    </Link>
                </div>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">User</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Plan</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Amount</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Started</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Ends</th>
                                <th className="text-right px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {subscriptions.data.map((sub) => (
                                <tr key={sub.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-secondary-900 dark:text-white">{sub.user_name || 'N/A'}</p>
                                        <p className="text-xs text-secondary-500">{sub.user_email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-700 dark:text-secondary-300">
                                        {sub.plan_name || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariants[sub.status] || 'secondary'} size="sm">
                                            {statusLabels[sub.status] || sub.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-700 dark:text-secondary-300">
                                        {sub.amount ? `₱${Number(sub.amount).toLocaleString()}` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {sub.starts_at ? new Date(sub.starts_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {sub.ends_at ? new Date(sub.ends_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('admin.subscriptions.show', sub.id)}
                                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    links={subscriptions.links}
                    from={subscriptions.from}
                    to={subscriptions.to}
                    total={subscriptions.total}
                />
            </Card>
        </AdminLayout>
    );
}
