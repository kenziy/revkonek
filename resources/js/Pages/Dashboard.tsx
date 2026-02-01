import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, StatCard, Avatar, Badge, EmptyState } from '@/Components/UI';
import { Switch } from '@/Components/Form';
import { useState } from 'react';
import clsx from 'clsx';
import {
    BoltIcon,
    TrophyIcon,
    StarIcon,
    FireIcon,
    ChevronRightIcon,
    ShieldExclamationIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';

interface DashboardProps {
    stats?: {
        totalChallenges: number;
        wins: number;
        rating: number;
        streak: number;
    };
    nearbyRiders?: Array<{
        id: number;
        name: string;
        avatar?: string;
        distance: string;
        bike: string;
    }>;
    recentActivity?: Array<{
        id: number;
        type: string;
        description: string;
        time: string;
    }>;
}

export default function Dashboard({
    stats = { totalChallenges: 0, wins: 0, rating: 0, streak: 0 },
    nearbyRiders = [],
    recentActivity = [],
}: DashboardProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [lookingForChallenge, setLookingForChallenge] = useState(false);

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h1>
                        <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">
                            Ready to ride today?
                        </p>
                    </div>
                    <Link
                        href={route('sos.index')}
                        className={clsx(
                            'flex items-center justify-center w-12 h-12 rounded-full',
                            'bg-danger-100 dark:bg-danger-900/30',
                            'text-danger-600 dark:text-danger-400',
                            'hover:bg-danger-200 dark:hover:bg-danger-900/50',
                            'transition-colors duration-200'
                        )}
                    >
                        <ShieldExclamationIcon className="h-6 w-6" />
                    </Link>
                </div>

                <Card variant="elevated" padding="lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                Looking for Challenge
                            </h3>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                Let other riders know you're ready to race
                            </p>
                        </div>
                        <Switch
                            checked={lookingForChallenge}
                            onChange={setLookingForChallenge}
                            size="lg"
                        />
                    </div>
                    {lookingForChallenge && (
                        <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700">
                            <div className="flex items-center gap-2 text-sm text-success-600 dark:text-success-400">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                                </span>
                                You're visible to nearby riders
                            </div>
                        </div>
                    )}
                </Card>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Challenges"
                        value={stats.totalChallenges}
                        icon={<BoltIcon className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Wins"
                        value={stats.wins}
                        icon={<TrophyIcon className="h-5 w-5" />}
                        variant="primary"
                    />
                    <StatCard
                        title="Rating"
                        value={stats.rating.toFixed(1)}
                        icon={<StarIcon className="h-5 w-5" />}
                        variant="warning"
                    />
                    <StatCard
                        title="Win Streak"
                        value={stats.streak}
                        icon={<FireIcon className="h-5 w-5" />}
                        variant="success"
                    />
                </div>

                <Card padding="none">
                    <div className="p-4 border-b border-secondary-100 dark:border-secondary-700">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-secondary-900 dark:text-white">
                                Nearby Riders
                            </h2>
                            <Link
                                href={route('match.index')}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                            >
                                View all
                                <ChevronRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                    {nearbyRiders.length > 0 ? (
                        <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {nearbyRiders.map((rider) => (
                                <Link
                                    key={rider.id}
                                    href={`/riders/${rider.id}`}
                                    className="flex items-center gap-3 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                                >
                                    <Avatar
                                        src={rider.avatar}
                                        name={rider.name}
                                        size="md"
                                        status="online"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-secondary-900 dark:text-white truncate">
                                            {rider.name}
                                        </p>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                                            {rider.bike}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-secondary-500 dark:text-secondary-400">
                                        <MapPinIcon className="h-4 w-4" />
                                        {rider.distance}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="search"
                            title="No nearby riders"
                            description="Turn on 'Looking for Challenge' to find riders near you"
                        />
                    )}
                </Card>

                <Card padding="none">
                    <div className="p-4 border-b border-secondary-100 dark:border-secondary-700">
                        <h2 className="font-semibold text-secondary-900 dark:text-white">
                            Recent Activity
                        </h2>
                    </div>
                    {recentActivity.length > 0 ? (
                        <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-3 p-4">
                                    <div
                                        className={clsx(
                                            'flex items-center justify-center w-10 h-10 rounded-full',
                                            activity.type === 'win'
                                                ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
                                                : activity.type === 'loss'
                                                ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
                                                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
                                        )}
                                    >
                                        {activity.type === 'win' ? (
                                            <TrophyIcon className="h-5 w-5" />
                                        ) : (
                                            <BoltIcon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-secondary-900 dark:text-white">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="inbox"
                            title="No recent activity"
                            description="Your challenge history will appear here"
                        />
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
