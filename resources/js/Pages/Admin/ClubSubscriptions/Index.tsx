import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, SearchBar } from '@/Components/UI';
import StatCard from '@/Components/UI/StatCard';
import Pagination from '@/Components/Admin/Pagination';
import Select from '@/Components/Form/Select';
import { AdminClubSubscriptionStats, PaginatedData } from '@/types/admin';
import { ClubSubscription, ClubSubscriptionStatus } from '@/types/club';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface Props {
    stats: AdminClubSubscriptionStats;
    subscriptions: PaginatedData<ClubSubscription>;
    filters: {
        status?: string;
        search?: string;
    };
}

const statusVariants: Record<ClubSubscriptionStatus, 'primary' | 'success' | 'danger' | 'warning' | 'secondary'> = {
    pending_verification: 'warning',
    active: 'success',
    expired: 'secondary',
    rejected: 'danger',
    cancelled: 'secondary',
};

const statusLabels: Record<ClubSubscriptionStatus, string> = {
    pending_verification: 'Pending',
    active: 'Active',
    expired: 'Expired',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
};

export default function ClubSubscriptionsIndex({ stats, subscriptions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        router.get(route('admin.club-subscriptions.index'), { ...filters, search: value }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.club-subscriptions.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout header="Club Subscriptions">
            <Head title="Admin - Club Subscriptions" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={<ClockIcon className="h-5 w-5" />}
                    variant={stats.pending > 0 ? 'warning' : 'default'}
                />
                <StatCard
                    title="Active"
                    value={stats.active}
                    icon={<CheckCircleIcon className="h-5 w-5" />}
                    variant="success"
                />
                <StatCard
                    title="Expired"
                    value={stats.expired}
                    icon={<ClockIcon className="h-5 w-5" />}
                />
                <StatCard
                    title="Rejected"
                    value={stats.rejected}
                    icon={<XCircleIcon className="h-5 w-5" />}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₱${Number(stats.totalRevenue).toLocaleString()}`}
                    icon={<CurrencyDollarIcon className="h-5 w-5" />}
                    variant="primary"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={handleSearch}
                        onClear={() => handleSearch('')}
                        placeholder="Search by club name..."
                        className="flex-1"
                    />
                    <Select
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'pending_verification', label: 'Pending' },
                            { value: 'active', label: 'Active' },
                            { value: 'expired', label: 'Expired' },
                            { value: 'rejected', label: 'Rejected' },
                            { value: 'cancelled', label: 'Cancelled' },
                        ]}
                        value={filters.status || ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route('admin.club-subscriptions.pricing')}
                        className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href={route('admin.club-subscriptions.coupons')}
                        className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                    >
                        Coupons
                    </Link>
                </div>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Club</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Requested By</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Amount</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Coupon</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Date</th>
                                <th className="text-right px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {subscriptions.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-secondary-500 dark:text-secondary-400">
                                        No subscriptions found.
                                    </td>
                                </tr>
                            )}
                            {subscriptions.data.map((sub) => (
                                <tr key={sub.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-secondary-900 dark:text-white">
                                            {sub.club?.name || 'N/A'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {sub.requester?.name || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-900 dark:text-white">
                                        <span className="font-medium">₱{Number(sub.amount).toLocaleString()}</span>
                                        {sub.coupon && (
                                            <span className="text-xs text-secondary-400 ml-1">
                                                (was ₱{Number(sub.original_amount).toLocaleString()})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {sub.coupon?.code || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariants[sub.status]} size="sm">
                                            {statusLabels[sub.status]}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {new Date(sub.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('admin.club-subscriptions.show', sub.id)}
                                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
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
