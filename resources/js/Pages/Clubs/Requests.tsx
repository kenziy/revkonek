import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Avatar } from '@/Components/UI';
import { Club, ClubJoinRequest } from '@/types/club';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface RequestsProps {
    club: Club;
    requests: { data: ClubJoinRequest[] };
}

export default function ClubRequests({ club, requests }: RequestsProps) {
    return (
        <AuthenticatedLayout header={`${club.name} — Join Requests`}>
            <Head title={`${club.name} Requests`} />

            <div className="space-y-3">
                <Link
                    href={route('clubs.show', club.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to {club.name}
                </Link>

                {requests.data.length > 0 ? (
                    requests.data.map((req) => (
                        <Card key={req.id}>
                            <div className="flex items-center gap-3">
                                <Avatar name={req.user?.display_name} size="md" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        {req.user?.display_name}
                                    </p>
                                    {req.message && (
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                                            "{req.message}"
                                        </p>
                                    )}
                                    <p className="text-xs text-secondary-400 mt-0.5">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.post(route('clubs.requests.approve', [club.slug, req.id]))}
                                        className="p-2 bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 rounded-lg hover:bg-success-200 dark:hover:bg-success-900/30 transition-colors"
                                        title="Approve"
                                    >
                                        <CheckIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => router.post(route('clubs.requests.reject', [club.slug, req.id]))}
                                        className="p-2 bg-danger-100 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 rounded-lg hover:bg-danger-200 dark:hover:bg-danger-900/30 transition-colors"
                                        title="Reject"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 py-8">
                            No pending join requests.
                        </p>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
