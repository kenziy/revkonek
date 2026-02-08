import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, SearchBar } from '@/Components/UI';
import Pagination from '@/Components/Admin/Pagination';
import Select from '@/Components/Form/Select';
import { PaginatedData } from '@/types/admin';
import { Club } from '@/types/club';

interface Props {
    clubs: PaginatedData<Club & { members_count: number }>;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
}

export default function ClubsIndex({ clubs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        router.get(route('admin.clubs.index'), { ...filters, search: value }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.clubs.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout header="Clubs">
            <Head title="Admin - Clubs" />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleSearch}
                    onClear={() => handleSearch('')}
                    placeholder="Search clubs..."
                    className="flex-1"
                />
                <Select
                    options={[
                        { value: '', label: 'All Types' },
                        { value: 'public', label: 'Public' },
                        { value: 'private', label: 'Private' },
                        { value: 'secret', label: 'Secret' },
                    ]}
                    value={filters.type || ''}
                    onChange={(e) => handleFilter('type', e.target.value)}
                />
                <Select
                    options={[
                        { value: '', label: 'All Status' },
                        { value: 'active', label: 'Active' },
                        { value: 'archived', label: 'Archived' },
                        { value: 'verified', label: 'Verified' },
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
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Club</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Type</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Members</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Owner</th>
                                <th className="text-right px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {clubs.data.map((club) => (
                                <tr key={club.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-secondary-900 dark:text-white">{club.name}</p>
                                            <p className="text-xs text-secondary-500">/{club.slug}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="secondary" size="sm">{club.type}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{club.members_count}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {club.is_verified && <Badge variant="info" size="sm">Verified</Badge>}
                                            {club.is_archived ? (
                                                <Badge variant="warning" size="sm">Archived</Badge>
                                            ) : club.is_active ? (
                                                <Badge variant="success" size="sm">Active</Badge>
                                            ) : (
                                                <Badge variant="danger" size="sm">Inactive</Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {club.owner?.display_name || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('admin.clubs.show', club.slug)}
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
                    links={clubs.links}
                    from={clubs.from}
                    to={clubs.to}
                    total={clubs.total}
                />
            </Card>
        </AdminLayout>
    );
}
