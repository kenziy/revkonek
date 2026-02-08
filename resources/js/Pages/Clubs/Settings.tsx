import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Badge } from '@/Components/UI';
import { Club, ClubSubscription } from '@/types/club';
import {
    ArrowLeftIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface SettingsProps {
    club: Club & { members_count?: number; posts_count?: number; events_count?: number };
    tier: string;
    activeSubscription?: ClubSubscription | null;
    latestSubscription?: ClubSubscription | null;
}

const subscriptionStatusLabels: Record<string, string> = {
    pending_verification: 'Pending Review',
    active: 'Active',
    expired: 'Expired',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
};

const subscriptionStatusVariants: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'secondary'> = {
    pending_verification: 'warning',
    active: 'success',
    expired: 'secondary',
    rejected: 'danger',
    cancelled: 'secondary',
};

export default function ClubSettings({ club, tier, activeSubscription, latestSubscription }: SettingsProps) {
    const isPro = tier === 'pro';

    return (
        <AuthenticatedLayout header={`${club.name} — Settings`}>
            <Head title={`${club.name} Settings`} />

            <div className="max-w-2xl mx-auto space-y-6">
                <Link
                    href={route('clubs.show', club.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to {club.name}
                </Link>

                {/* Club info */}
                <Card padding="lg">
                    <h2 className="font-semibold text-secondary-900 dark:text-white mb-4">
                        Club Overview
                    </h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-1 text-secondary-500 dark:text-secondary-400 mb-1">
                                <UserGroupIcon className="h-4 w-4" />
                            </div>
                            <p className="text-xl font-bold text-secondary-900 dark:text-white">
                                {club.members_count ?? 0}
                            </p>
                            <p className="text-xs text-secondary-400">Members</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 text-secondary-500 dark:text-secondary-400 mb-1">
                                <DocumentTextIcon className="h-4 w-4" />
                            </div>
                            <p className="text-xl font-bold text-secondary-900 dark:text-white">
                                {club.posts_count ?? 0}
                            </p>
                            <p className="text-xs text-secondary-400">Posts</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 text-secondary-500 dark:text-secondary-400 mb-1">
                                <CalendarDaysIcon className="h-4 w-4" />
                            </div>
                            <p className="text-xl font-bold text-secondary-900 dark:text-white">
                                {club.events_count ?? 0}
                            </p>
                            <p className="text-xs text-secondary-400">Events</p>
                        </div>
                    </div>
                </Card>

                {/* Join Approval */}
                <Card padding="lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                                <ShieldCheckIcon className="h-5 w-5 text-primary-500" />
                                Join Approval
                            </h2>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                Require approval before new members can join, even for public clubs.
                            </p>
                        </div>
                        <button
                            onClick={() => router.put(route('clubs.update', club.slug), {
                                requires_approval: !club.requires_approval,
                            }, { preserveScroll: true })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                club.requires_approval ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    club.requires_approval ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </Card>

                {/* Tier */}
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-secondary-900 dark:text-white">
                            Club Tier
                        </h2>
                        <Badge variant={isPro ? 'warning' : 'secondary'} size="sm">
                            {isPro ? 'PRO' : 'FREE'}
                        </Badge>
                    </div>

                    <div className="space-y-3">
                        {[
                            { feature: 'Max Members', free: '50', pro: 'Unlimited' },
                            { feature: 'Max Vice Presidents', free: '1', pro: 'Unlimited' },
                            { feature: 'Max Officers', free: '3', pro: 'Unlimited' },
                            { feature: 'Rides / Month', free: '5', pro: 'Unlimited' },
                            { feature: 'Pinned Posts', free: '1', pro: 'Unlimited' },
                            { feature: 'Club Chat', free: 'No', pro: 'Yes' },
                            { feature: 'Cover Image', free: 'No', pro: 'Yes' },
                            { feature: 'Custom Theme', free: 'No', pro: 'Yes' },
                            { feature: 'Analytics', free: 'No', pro: 'Yes' },
                            { feature: 'Verified Badge', free: 'No', pro: 'Yes' },
                            { feature: 'Members-Only Posts', free: 'No', pro: 'Yes' },
                            { feature: 'Event Management', free: 'No', pro: 'Yes' },
                        ].map(({ feature, free, pro }) => (
                            <div key={feature} className="flex items-center justify-between text-sm">
                                <span className="text-secondary-600 dark:text-secondary-400">{feature}</span>
                                <span className={isPro ? 'text-warning-600 font-medium' : 'text-secondary-500'}>
                                    {isPro ? pro : free}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Subscription / Upgrade */}
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5 text-accent-500" />
                            Pro Subscription
                        </h2>
                        {latestSubscription && (
                            <Badge
                                variant={subscriptionStatusVariants[latestSubscription.status] || 'secondary'}
                                size="sm"
                            >
                                {subscriptionStatusLabels[latestSubscription.status] || latestSubscription.status}
                            </Badge>
                        )}
                    </div>

                    {isPro && activeSubscription ? (
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            <p>Your club is on the <strong className="text-accent-600">Pro</strong> plan.</p>
                            {activeSubscription.ends_at && (
                                <p className="mt-1">
                                    Valid until {new Date(activeSubscription.ends_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ) : latestSubscription?.status === 'pending_verification' ? (
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            <p>Your upgrade request is currently under review.</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                                Unlock all Pro features for your club.
                            </p>
                            <Link
                                href={route('clubs.subscription', club.slug)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                                <SparklesIcon className="h-4 w-4" />
                                Upgrade to Pro
                            </Link>
                        </div>
                    )}
                </Card>

                {/* Danger Zone */}
                <Card padding="lg" className="border-danger-200 dark:border-danger-800">
                    <h2 className="font-semibold text-danger-600 dark:text-danger-400 flex items-center gap-2 mb-4">
                        <ExclamationTriangleIcon className="h-5 w-5" />
                        Danger Zone
                    </h2>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                        Deleting this club is permanent and cannot be undone. All members, posts, events, and chat messages will be lost.
                    </p>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
                                router.delete(route('clubs.destroy', club.slug));
                            }
                        }}
                        className="px-4 py-2 bg-danger-600 hover:bg-danger-500 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                        Delete Club
                    </button>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
