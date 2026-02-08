import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, SearchBar } from '@/Components/UI';
import Pagination from '@/Components/Admin/Pagination';
import Select from '@/Components/Form/Select';
import { AdminShop, PaginatedData } from '@/types/admin';

interface Props {
    shops: PaginatedData<AdminShop>;
    filters: {
        search?: string;
        verification_status?: string;
    };
}

const verificationVariants: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'secondary'> = {
    pending: 'warning',
    verified: 'success',
    rejected: 'danger',
};

export default function ShopsIndex({ shops, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        router.get(route('admin.shops.index'), { ...filters, search: value }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.shops.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout header="Shops">
            <Head title="Admin - Shops" />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleSearch}
                    onClear={() => handleSearch('')}
                    placeholder="Search shops..."
                    className="flex-1"
                />
                <Select
                    options={[
                        { value: '', label: 'All Status' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'verified', label: 'Verified' },
                        { value: 'rejected', label: 'Rejected' },
                    ]}
                    value={filters.verification_status || ''}
                    onChange={(e) => handleFilter('verification_status', e.target.value)}
                />
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Shop</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Owner</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Location</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Verification</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Active</th>
                                <th className="text-right px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {shops.data.map((shop) => (
                                <tr key={shop.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-secondary-900 dark:text-white">{shop.name}</p>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{shop.owner_name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {[shop.city, shop.province].filter(Boolean).join(', ')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={verificationVariants[shop.verification_status] || 'secondary'} size="sm">
                                            {shop.verification_status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={shop.is_active ? 'success' : 'danger'} size="sm">
                                            {shop.is_active ? 'Yes' : 'No'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('admin.shops.show', shop.id)}
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
                    links={shops.links}
                    from={shops.from}
                    to={shops.to}
                    total={shops.total}
                />
            </Card>
        </AdminLayout>
    );
}
