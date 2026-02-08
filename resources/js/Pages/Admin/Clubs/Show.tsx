import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, Avatar } from '@/Components/UI';
import { Club } from '@/types/club';

interface Props {
    club: Club & {
        members_count: number;
        posts_count: number;
        events_count: number;
        followers_count: number;
        owner?: {
            id: number;
            name: string;
            username?: string;
            email: string;
        };
    };
}

export default function ClubShow({ club }: Props) {
    const handleArchive = () => {
        if (confirm('Are you sure you want to archive this club?')) {
            router.post(route('admin.clubs.archive', club.slug));
        }
    };

    const handleUnarchive = () => {
        router.post(route('admin.clubs.unarchive', club.slug));
    };

    const handleVerify = () => {
        router.post(route('admin.clubs.verify', club.slug));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to permanently delete this club? This cannot be undone.')) {
            router.delete(route('admin.clubs.destroy', club.slug));
        }
    };

    return (
        <AdminLayout header={`Club: ${club.name}`}>
            <Head title={`Admin - ${club.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">{club.name}</h2>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">/{club.slug}</p>
                            </div>
                            <div className="flex gap-2">
                                {club.is_verified && <Badge variant="info">Verified</Badge>}
                                <Badge variant={club.is_active ? 'success' : 'danger'}>
                                    {club.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                {club.is_archived && <Badge variant="warning">Archived</Badge>}
                                <Badge variant="secondary">{club.type}</Badge>
                            </div>
                        </div>
                        {club.description && (
                            <p className="mt-4 text-secondary-700 dark:text-secondary-300">{club.description}</p>
                        )}
                        {(club.city || club.province) && (
                            <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                                {[club.city, club.province].filter(Boolean).join(', ')}
                            </p>
                        )}
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Statistics</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{club.members_count}</p>
                                <p className="text-xs text-secondary-500">Members</p>
                            </div>
                            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{club.posts_count}</p>
                                <p className="text-xs text-secondary-500">Posts</p>
                            </div>
                            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{club.events_count}</p>
                                <p className="text-xs text-secondary-500">Events</p>
                            </div>
                            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{club.followers_count}</p>
                                <p className="text-xs text-secondary-500">Followers</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Owner</h3>
                        {club.owner && (
                            <div className="flex items-center gap-3">
                                <Avatar name={club.owner.name} size="md" />
                                <div>
                                    <p className="font-medium text-secondary-900 dark:text-white">{club.owner.name}</p>
                                    <p className="text-xs text-secondary-500">{club.owner.email}</p>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Admin Actions</h3>
                        <div className="space-y-2">
                            {!club.is_verified && (
                                <button
                                    onClick={handleVerify}
                                    className="w-full px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                                >
                                    Verify Club
                                </button>
                            )}
                            {club.is_archived ? (
                                <button
                                    onClick={handleUnarchive}
                                    className="w-full px-4 py-2 text-sm font-medium text-success-600 bg-success-50 rounded-lg hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400 transition-colors"
                                >
                                    Unarchive Club
                                </button>
                            ) : (
                                <button
                                    onClick={handleArchive}
                                    className="w-full px-4 py-2 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg hover:bg-accent-100 dark:bg-accent-900/20 dark:text-accent-400 transition-colors"
                                >
                                    Archive Club
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="w-full px-4 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400 transition-colors"
                            >
                                Delete Club
                            </button>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Details</h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-secondary-500">Premium</dt>
                                <dd className="text-secondary-900 dark:text-white">{club.is_premium ? 'Yes' : 'No'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-secondary-500">Created</dt>
                                <dd className="text-secondary-900 dark:text-white">{new Date(club.created_at).toLocaleDateString()}</dd>
                            </div>
                            {club.last_activity_at && (
                                <div className="flex justify-between">
                                    <dt className="text-secondary-500">Last Activity</dt>
                                    <dd className="text-secondary-900 dark:text-white">{new Date(club.last_activity_at).toLocaleDateString()}</dd>
                                </div>
                            )}
                        </dl>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
