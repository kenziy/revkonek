import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Tabs, Badge, Avatar, EmptyState, FloatingActionButton } from '@/Components/UI';
import clsx from 'clsx';
import { BoltIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Challenge {
    id: number;
    opponent: {
        name: string;
        avatar?: string;
    };
    bike: string;
    location: string;
    scheduledAt?: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    result?: 'win' | 'loss' | 'draw';
}

interface ChallengesIndexProps {
    activeChallenges?: Challenge[];
    pendingChallenges?: Challenge[];
    historyChallenge?: Challenge[];
}

export default function ChallengesIndex({
    activeChallenges = [],
    pendingChallenges = [],
    historyChallenge = [],
}: ChallengesIndexProps) {
    const renderChallengeCard = (challenge: Challenge) => (
        <Link key={challenge.id} href={route('challenges.show', challenge.id)}>
            <Card hoverable className="mb-3">
                <div className="flex items-center gap-3">
                    <Avatar
                        src={challenge.opponent.avatar}
                        name={challenge.opponent.name}
                        size="lg"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-secondary-900 dark:text-white truncate">
                                vs {challenge.opponent.name}
                            </h3>
                            {challenge.result && (
                                <Badge
                                    variant={
                                        challenge.result === 'win'
                                            ? 'success'
                                            : challenge.result === 'loss'
                                            ? 'danger'
                                            : 'secondary'
                                    }
                                    size="sm"
                                >
                                    {challenge.result.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            {challenge.bike}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-secondary-400">
                            <span className="flex items-center gap-1">
                                <ClockIcon className="h-3.5 w-3.5" />
                                {challenge.scheduledAt || 'Flexible'}
                            </span>
                            <span>{challenge.location}</span>
                        </div>
                    </div>
                    <div
                        className={clsx(
                            'flex items-center justify-center w-10 h-10 rounded-full',
                            challenge.status === 'pending' && 'bg-accent-100 dark:bg-accent-900/30 text-accent-600',
                            challenge.status === 'active' && 'bg-primary-100 dark:bg-primary-900/30 text-primary-600',
                            challenge.status === 'completed' &&
                                challenge.result === 'win' &&
                                'bg-success-100 dark:bg-success-900/30 text-success-600',
                            challenge.status === 'completed' &&
                                challenge.result === 'loss' &&
                                'bg-danger-100 dark:bg-danger-900/30 text-danger-600',
                            challenge.status === 'cancelled' && 'bg-secondary-100 dark:bg-secondary-800 text-secondary-400'
                        )}
                    >
                        {challenge.status === 'completed' && challenge.result === 'win' ? (
                            <CheckCircleIcon className="h-5 w-5" />
                        ) : challenge.status === 'cancelled' || challenge.result === 'loss' ? (
                            <XCircleIcon className="h-5 w-5" />
                        ) : (
                            <BoltIcon className="h-5 w-5" />
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );

    return (
        <AuthenticatedLayout header="Challenges">
            <Head title="Challenges" />

            <Tabs defaultValue="active" className="space-y-4">
                <Tabs.List fullWidth>
                    <Tabs.Trigger value="active">
                        Active
                        {activeChallenges.length > 0 && (
                            <Badge variant="primary" size="sm" className="ml-2">
                                {activeChallenges.length}
                            </Badge>
                        )}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="pending">
                        Pending
                        {pendingChallenges.length > 0 && (
                            <Badge variant="warning" size="sm" className="ml-2">
                                {pendingChallenges.length}
                            </Badge>
                        )}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="history">History</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="active" className="mt-4">
                    {activeChallenges.length > 0 ? (
                        activeChallenges.map(renderChallengeCard)
                    ) : (
                        <Card>
                            <EmptyState
                                icon={<BoltIcon className="h-8 w-8" />}
                                title="No active challenges"
                                description="Create a new challenge or accept a pending one"
                                action={{
                                    label: 'Find Riders',
                                    onClick: () => (window.location.href = route('match.index')),
                                }}
                            />
                        </Card>
                    )}
                </Tabs.Content>

                <Tabs.Content value="pending" className="mt-4">
                    {pendingChallenges.length > 0 ? (
                        pendingChallenges.map(renderChallengeCard)
                    ) : (
                        <Card>
                            <EmptyState
                                icon={<ClockIcon className="h-8 w-8" />}
                                title="No pending challenges"
                                description="When you receive or send a challenge, it will appear here"
                            />
                        </Card>
                    )}
                </Tabs.Content>

                <Tabs.Content value="history" className="mt-4">
                    {historyChallenge.length > 0 ? (
                        historyChallenge.map(renderChallengeCard)
                    ) : (
                        <Card>
                            <EmptyState
                                icon="inbox"
                                title="No challenge history"
                                description="Your completed challenges will appear here"
                            />
                        </Card>
                    )}
                </Tabs.Content>
            </Tabs>

            <FloatingActionButton
                icon={<BoltIcon className="h-6 w-6" />}
                onClick={() => (window.location.href = route('challenges.create'))}
            />
        </AuthenticatedLayout>
    );
}
