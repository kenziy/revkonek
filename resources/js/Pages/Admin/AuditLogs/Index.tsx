import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, SearchBar } from '@/Components/UI';
import Pagination from '@/Components/Admin/Pagination';
import Select from '@/Components/Form/Select';
import { AuditLog, PaginatedData } from '@/types/admin';

interface Props {
    logs: PaginatedData<AuditLog>;
    actions: string[];
    filters: {
        search?: string;
        action?: string;
    };
}

export default function AuditLogsIndex({ logs, actions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        router.get(route('admin.audit-logs.index'), { ...filters, search: value }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.audit-logs.index'), { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout header="Audit Logs">
            <Head title="Admin - Audit Logs" />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleSearch}
                    onClear={() => handleSearch('')}
                    placeholder="Search logs..."
                    className="flex-1"
                />
                <Select
                    options={[
                        { value: '', label: 'All Actions' },
                        ...actions.map((a) => ({ value: a, label: a })),
                    ]}
                    value={filters.action || ''}
                    onChange={(e) => handleFilter('action', e.target.value)}
                />
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Action</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">User</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Target</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">IP</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                    <td className="px-4 py-3">
                                        <Badge variant="secondary" size="sm">{log.action}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-secondary-900 dark:text-white">{log.user_name || 'System'}</p>
                                        {log.user_email && (
                                            <p className="text-xs text-secondary-500">{log.user_email}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {log.auditable_type ? (
                                            <span>
                                                {log.auditable_type.split('\\').pop()} #{log.auditable_id}
                                            </span>
                                        ) : (
                                            <span className="text-secondary-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400 font-mono text-xs">
                                        {log.ip_address || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    links={logs.links}
                    from={logs.from}
                    to={logs.to}
                    total={logs.total}
                />
            </Card>
        </AdminLayout>
    );
}
