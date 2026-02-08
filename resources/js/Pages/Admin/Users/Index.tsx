import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, Avatar, SearchBar } from '@/Components/UI';
import Pagination from '@/Components/Admin/Pagination';
import Select from '@/Components/Form/Select';
import { AdminUser, PaginatedData } from '@/types/admin';

interface Props {
    users: PaginatedData<AdminUser>;
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
    roles: string[];
}

export default function UsersIndex({ users, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        router.get(route('admin.users.index'), { ...filters, search: value }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.users.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout header="Users">
            <Head title="Admin - Users" />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleSearch}
                    onClear={() => handleSearch('')}
                    placeholder="Search users..."
                    className="flex-1"
                />
                <Select
                    options={[
                        { value: '', label: 'All Roles' },
                        ...roles.map((r) => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) })),
                    ]}
                    value={filters.role || ''}
                    onChange={(e) => handleFilter('role', e.target.value)}
                />
                <Select
                    options={[
                        { value: '', label: 'All Status' },
                        { value: 'active', label: 'Active' },
                        { value: 'banned', label: 'Banned' },
                    ]}
                    value={filters.status || ''}
                    onChange={(e) => handleFilter('status', e.target.value)}
                />
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">User</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Email</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Joined</th>
                                <th className="text-right px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={user.name} size="sm" />
                                            <div>
                                                <p className="font-medium text-secondary-900 dark:text-white">{user.name}</p>
                                                {user.username && (
                                                    <p className="text-xs text-secondary-500">@{user.username}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={user.is_active ? 'success' : 'danger'} size="sm">
                                            {user.is_active ? 'Active' : 'Banned'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('admin.users.show', user.id)}
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
                    links={users.links}
                    from={users.from}
                    to={users.to}
                    total={users.total}
                />
            </Card>
        </AdminLayout>
    );
}
