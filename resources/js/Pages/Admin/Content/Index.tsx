import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, EmptyState } from '@/Components/UI';
import Pagination from '@/Components/Admin/Pagination';
import Select from '@/Components/Form/Select';
import { AdminContentItem, PaginatedData } from '@/types/admin';

interface Props {
    content: PaginatedData<AdminContentItem>;
    filters: {
        type: string;
    };
}

export default function ContentIndex({ content, filters }: Props) {
    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.content.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this content?')) {
            router.delete(route('admin.content.destroy', { type: filters.type, id }));
        }
    };

    return (
        <AdminLayout header="Content Moderation">
            <Head title="Admin - Content" />

            <div className="flex justify-end mb-6">
                <Select
                    options={[
                        { value: 'posts', label: 'Club Posts' },
                    ]}
                    value={filters.type}
                    onChange={(e) => handleFilter('type', e.target.value)}
                />
            </div>

            {content.data?.length > 0 ? (
                <Card padding="none">
                    <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                        {content.data.map((item) => (
                            <div key={item.id} className="px-4 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-secondary-900 dark:text-white">
                                                {item.user_name || 'Unknown'}
                                            </span>
                                            {item.club_name && (
                                                <span className="text-xs text-secondary-500">
                                                    in {item.club_name}
                                                </span>
                                            )}
                                            {item.is_announcement && (
                                                <Badge variant="warning" size="sm">Announcement</Badge>
                                            )}
                                            <Badge variant="secondary" size="sm">{item.visibility}</Badge>
                                        </div>
                                        <p className="text-sm text-secondary-700 dark:text-secondary-300 line-clamp-2">
                                            {item.content}
                                        </p>
                                        <p className="text-xs text-secondary-500 mt-1">
                                            {new Date(item.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="ml-4 px-3 py-1.5 text-xs font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        links={content.links}
                        from={content.from}
                        to={content.to}
                        total={content.total}
                    />
                </Card>
            ) : (
                <EmptyState
                    title="No content to moderate"
                    description="All content looks clean."
                />
            )}
        </AdminLayout>
    );
}
