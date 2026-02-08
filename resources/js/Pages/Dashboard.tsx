import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Card, Badge, ProgressBar, Avatar, EmptyState } from '@/Components/UI';
import { useState } from 'react';
import clsx from 'clsx';
import {
    WrenchScrewdriverIcon,
    ShieldExclamationIcon,
    UserCircleIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    SparklesIcon,
    RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import {
    CheckCircleIcon as CheckCircleSolidIcon,
    HeartIcon,
    CalendarDaysIcon,
    CheckBadgeIcon,
    MapPinIcon,
    ClockIcon,
    UserIcon,
} from '@heroicons/react/24/solid';
import type {
    FeedItem,
    FeedResponse,
    FeedPostData,
    FeedVehicleData,
    FeedEventData,
    SidebarEvent,
    SidebarClub,
} from '@/types/feed';
import { isPostItem, isVehicleItem, isEventItem } from '@/types/feed';

interface OnboardingStep {
    key: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    buttonText: string;
    completed: boolean;
}

interface DashboardProps {
    onboarding: {
        hasBike: boolean;
        hasEmergencyContact: boolean;
        hasProfileComplete: boolean;
        hasJoinedClub: boolean;
    };
    onboardingComplete: boolean;
    completedSteps: number;
    totalSteps: number;
    primaryBike?: {
        id: number;
        uuid: string;
        make: string;
        model: string;
        year: number;
        photo?: string;
    } | null;
    feed?: FeedResponse;
    sidebarEvents?: SidebarEvent[];
    userClubs?: SidebarClub[];
}

function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatEventDate(dateString: string): { month: string; day: string } {
    const date = new Date(dateString);
    return {
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        day: date.getDate().toString(),
    };
}

function formatEventTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const EVENT_TYPE_LABELS: Record<string, string> = {
    ride: 'Ride',
    meetup: 'Meetup',
    track_day: 'Track Day',
    workshop: 'Workshop',
};

// ── Feed Card Components ─────────────────────────────────────

function FeedPostCard({ item }: { item: FeedItem }) {
    const data = item.data as FeedPostData;

    return (
        <Card padding="none">
            {/* Club header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                <Link href={route('clubs.show', data.club.slug)}>
                    <Avatar
                        src={data.club.avatar}
                        name={data.club.name}
                        size="sm"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <Link
                            href={route('clubs.show', data.club.slug)}
                            className="text-sm font-semibold text-secondary-900 dark:text-white hover:underline truncate"
                        >
                            {data.club.name}
                        </Link>
                        {data.club.is_verified && (
                            <CheckBadgeIcon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-secondary-500 dark:text-secondary-400">
                        <span>{data.user.display_name}</span>
                        <span>&middot;</span>
                        <span>{formatTimeAgo(data.created_at)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {item.source === 'discovery' && (
                        <Badge variant="secondary" size="sm">Suggested</Badge>
                    )}
                    {data.is_pinned && (
                        <Badge variant="warning" size="sm">Pinned</Badge>
                    )}
                    {data.is_announcement && (
                        <Badge variant="info" size="sm">Announcement</Badge>
                    )}
                </div>
            </div>

            {/* Post content */}
            <div className="px-4 pb-4">
                <p className="text-secondary-800 dark:text-secondary-200 text-sm whitespace-pre-wrap leading-relaxed">
                    {data.content}
                </p>
            </div>
        </Card>
    );
}

function FeedVehicleCard({ item }: { item: FeedItem }) {
    const data = item.data as FeedVehicleData;

    return (
        <Card padding="none" className="overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                <SparklesIcon className="h-4 w-4 text-accent-500" />
                <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wide">
                    Vehicle Spotlight
                </span>
            </div>

            {/* Photo */}
            {data.photo && (
                <Link href={route('vehicles.show', data.uuid)}>
                    <div className="aspect-video bg-secondary-100 dark:bg-secondary-800">
                        <img
                            src={data.photo}
                            alt={data.display_name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
            )}

            {/* Info */}
            <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <Link
                            href={route('vehicles.show', data.uuid)}
                            className="text-base font-bold text-secondary-900 dark:text-white hover:underline block truncate"
                        >
                            {data.display_name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                            {data.category && (
                                <Badge variant="secondary" size="sm">{data.category}</Badge>
                            )}
                            {data.engine_spec && (
                                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                    {data.engine_spec}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-danger-500 flex-shrink-0">
                        <HeartIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{data.likes_count}</span>
                    </div>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                    <Avatar
                        src={data.owner.avatar}
                        name={data.owner.display_name}
                        size="xs"
                    />
                    <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        Owned by{' '}
                        <Link
                            href={route('profile.show', data.owner.uuid)}
                            className="font-medium text-secondary-700 dark:text-secondary-300 hover:underline"
                        >
                            {data.owner.display_name}
                        </Link>
                    </span>
                </div>
            </div>
        </Card>
    );
}

function FeedEventCard({ item }: { item: FeedItem }) {
    const data = item.data as FeedEventData;
    const { month, day } = formatEventDate(data.starts_at);

    return (
        <Card padding="none">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                <CalendarDaysIcon className="h-4 w-4 text-primary-500" />
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                    Upcoming Event
                </span>
            </div>

            <div className="flex items-start gap-4 px-4 pb-4">
                {/* Date box */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase">
                        {month}
                    </span>
                    <span className="text-lg font-bold text-primary-700 dark:text-primary-300 leading-tight">
                        {day}
                    </span>
                </div>

                {/* Event details */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-secondary-900 dark:text-white text-sm truncate">
                        {data.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="primary" size="sm">
                            {EVENT_TYPE_LABELS[data.type] || data.type}
                        </Badge>
                        <Link
                            href={route('clubs.show', data.club.slug)}
                            className="text-xs text-secondary-500 dark:text-secondary-400 hover:underline"
                        >
                            {data.club.name}
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-secondary-500 dark:text-secondary-400">
                        {data.location_name && (
                            <span className="flex items-center gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{data.location_name}</span>
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            {formatEventTime(data.starts_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            {data.rsvps_count} going
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function FeedCard({ item }: { item: FeedItem }) {
    if (isPostItem(item)) return <FeedPostCard item={item} />;
    if (isVehicleItem(item)) return <FeedVehicleCard item={item} />;
    if (isEventItem(item)) return <FeedEventCard item={item} />;
    return null;
}

// ── Sidebar Widget Components ────────────────────────────────

function PrimaryBikeWidget({ bike }: { bike: NonNullable<DashboardProps['primaryBike']> }) {
    return (
        <Card padding="none" hoverable>
            <Link href={route('vehicles.show', bike.uuid)} className="flex items-center gap-3 p-3">
                <div className="w-14 h-14 rounded-lg bg-secondary-100 dark:bg-secondary-800 overflow-hidden flex-shrink-0">
                    {bike.photo ? (
                        <img
                            src={bike.photo}
                            alt={`${bike.make} ${bike.model}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <WrenchScrewdriverIcon className="h-6 w-6 text-secondary-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wide">
                        Your Ride
                    </p>
                    <h3 className="text-sm font-bold text-secondary-900 dark:text-white truncate">
                        {bike.year} {bike.make} {bike.model}
                    </h3>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
            </Link>
        </Card>
    );
}

function UpcomingEventsWidget({ events }: { events: SidebarEvent[] }) {
    if (events.length === 0) return null;

    return (
        <Card>
            <h3 className="font-semibold text-secondary-900 dark:text-white text-sm mb-3">
                Upcoming Events
            </h3>
            <div className="space-y-3">
                {events.map((event) => {
                    const { month, day } = formatEventDate(event.starts_at);
                    return (
                        <div key={event.id} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center">
                                <span className="text-[8px] font-bold text-primary-600 dark:text-primary-400 uppercase leading-none">
                                    {month}
                                </span>
                                <span className="text-sm font-bold text-primary-700 dark:text-primary-300 leading-tight">
                                    {day}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                                    {event.title}
                                </p>
                                <Link
                                    href={route('clubs.show', event.club_slug)}
                                    className="text-xs text-secondary-500 dark:text-secondary-400 hover:underline"
                                >
                                    {event.club_name}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

function MyClubsWidget({ clubs }: { clubs: SidebarClub[] }) {
    if (clubs.length === 0) return null;

    return (
        <Card>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-secondary-900 dark:text-white text-sm">
                    My Clubs
                </h3>
                <Link
                    href={route('clubs.index')}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                    See All
                </Link>
            </div>
            <div className="space-y-2.5">
                {clubs.map((club) => (
                    <Link
                        key={club.id}
                        href={route('clubs.show', club.slug)}
                        className="flex items-center gap-3 p-1.5 -mx-1.5 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                    >
                        <Avatar
                            src={club.avatar}
                            name={club.name}
                            size="sm"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                                {club.name}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                {club.members_count} {club.members_count === 1 ? 'member' : 'members'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    );
}

function QuickActionsWidget({ hasSos }: { hasSos: boolean }) {
    return (
        <Card>
            <h3 className="font-semibold text-secondary-900 dark:text-white text-sm mb-3">
                Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
                <Link
                    href={route('clubs.index')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                >
                    <UserGroupIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                    <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">Clubs</span>
                </Link>
                <Link
                    href={route('vehicles.index')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                >
                    <WrenchScrewdriverIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">Vehicles</span>
                </Link>
                <Link
                    href={route('shop.index')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                >
                    <RocketLaunchIcon className="h-5 w-5 text-info-600 dark:text-info-400" />
                    <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">Shop</span>
                </Link>
                {hasSos && (
                    <Link
                        href={route('sos.index')}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                    >
                        <ShieldExclamationIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
                        <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">SOS</span>
                    </Link>
                )}
            </div>
        </Card>
    );
}

// ── Main Dashboard Component ─────────────────────────────────

export default function Dashboard({
    onboarding,
    onboardingComplete,
    completedSteps,
    totalSteps,
    primaryBike,
    feed,
    sidebarEvents = [],
    userClubs = [],
}: DashboardProps) {
    const { auth, features } = usePage().props as any;
    const user = auth?.user;
    const firstName = user?.display_name?.split(' ')[0] || 'Rider';

    const [feedItems, setFeedItems] = useState<FeedItem[]>(feed?.items ?? []);
    const [hasMore, setHasMore] = useState(feed?.has_more ?? false);
    const [nextOffset, setNextOffset] = useState(feed?.next_offset ?? 0);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const response = await fetch(
                route('dashboard.feed', { offset: nextOffset, limit: 15 }),
                {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            );
            if (response.ok) {
                const data: FeedResponse = await response.json();
                setFeedItems((prev) => [...prev, ...data.items]);
                setHasMore(data.has_more);
                setNextOffset(data.next_offset);
            }
        } finally {
            setLoadingMore(false);
        }
    };

    const allSteps: OnboardingStep[] = [
        {
            key: 'hasBike',
            title: 'Add Your Bike',
            description: 'Tell us about your ride to showcase it on your profile.',
            icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
            href: route('garage.create'),
            buttonText: 'Add Bike',
            completed: onboarding.hasBike,
        },
        ...(features?.sos !== false ? [{
            key: 'hasEmergencyContact',
            title: 'Set Up Emergency Contacts',
            description: 'Add someone who can be notified in case of emergency.',
            icon: <ShieldExclamationIcon className="h-6 w-6" />,
            href: route('sos.contacts'),
            buttonText: 'Add Contact',
            completed: onboarding.hasEmergencyContact,
        }] : []),
        {
            key: 'hasProfileComplete',
            title: 'Complete Your Profile',
            description: 'Let other riders know who you are.',
            icon: <UserCircleIcon className="h-6 w-6" />,
            href: route('profile.edit'),
            buttonText: 'Edit Profile',
            completed: onboarding.hasProfileComplete,
        },
        {
            key: 'hasJoinedClub',
            title: 'Join a Club',
            description: 'Connect with local riders and join club rides.',
            icon: <UserGroupIcon className="h-6 w-6" />,
            href: route('clubs.index'),
            buttonText: 'Find Clubs',
            completed: onboarding.hasJoinedClub,
        },
    ];
    const steps = allSteps;

    const currentStepIndex = steps.findIndex(step => !step.completed);
    const currentStep = currentStepIndex !== -1 ? steps[currentStepIndex] : null;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    // Onboarding view (unchanged)
    if (!onboardingComplete) {
        return (
            <AuthenticatedLayout header="Welcome">
                <Head title="Getting Started" />

                <div className="space-y-6">
                    {/* Welcome Header */}
                    <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                            <SparklesIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            Welcome to REV KONEK, {firstName}!
                        </h1>
                        <p className="text-secondary-500 dark:text-secondary-400 mt-2 max-w-md mx-auto">
                            Let's get you set up in just a few steps. This will help you get the most out of the app.
                        </p>
                    </div>

                    {/* Progress Card */}
                    <Card padding="lg">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Setup Progress
                            </span>
                            <span className="text-sm text-secondary-500 dark:text-secondary-400">
                                {completedSteps} of {totalSteps} complete
                            </span>
                        </div>
                        <ProgressBar value={progressPercentage} variant="primary" size="md" />
                    </Card>

                    {/* Current Step - Highlighted */}
                    {currentStep && (
                        <Card variant="elevated" padding="lg" className="border-2 border-primary-200 dark:border-primary-800">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                        {currentStep.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="primary" size="sm">
                                            Step {currentStepIndex + 1}
                                        </Badge>
                                        <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                            Current Step
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                        {currentStep.title}
                                    </h3>
                                    <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                                        {currentStep.description}
                                    </p>
                                    <Link
                                        href={currentStep.href}
                                        className={clsx(
                                            'inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg',
                                            'bg-primary-600 hover:bg-primary-500 text-white',
                                            'font-semibold text-sm transition-colors'
                                        )}
                                    >
                                        {currentStep.buttonText}
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* All Steps Overview */}
                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                            All Steps
                        </h3>
                        <div className="space-y-3">
                            {steps.map((step, index) => (
                                <div
                                    key={step.key}
                                    className={clsx(
                                        'flex items-center gap-4 p-3 rounded-lg transition-colors',
                                        step.completed
                                            ? 'bg-success-50 dark:bg-success-900/20'
                                            : 'bg-secondary-50 dark:bg-secondary-800/50'
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                            step.completed
                                                ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
                                                : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500'
                                        )}
                                    >
                                        {step.completed ? (
                                            <CheckCircleSolidIcon className="h-6 w-6" />
                                        ) : (
                                            <span className="text-sm font-semibold">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={clsx(
                                                'font-medium',
                                                step.completed
                                                    ? 'text-success-700 dark:text-success-300'
                                                    : 'text-secondary-900 dark:text-white'
                                            )}
                                        >
                                            {step.title}
                                        </p>
                                        {step.completed && (
                                            <p className="text-xs text-success-600 dark:text-success-400">
                                                Completed
                                            </p>
                                        )}
                                    </div>
                                    {!step.completed && (
                                        <Link
                                            href={step.href}
                                            className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                                        >
                                            {index === currentStepIndex ? 'Start' : 'Go'}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Skip Setup */}
                    <div className="text-center space-y-2">
                        <button
                            onClick={() => router.post(route('dashboard.skipOnboarding'))}
                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Skip setup and go to dashboard
                        </button>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            You can always complete these steps later from your profile.
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // ── News Feed Dashboard ──────────────────────────────────
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-4">
                {/* Welcome header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            Hey, {firstName}!
                        </h1>
                        <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">
                            Here's what's happening in your community
                        </p>
                    </div>
                    {features?.sos !== false && (
                        <Link
                            href={route('sos.index')}
                            className={clsx(
                                'flex items-center justify-center w-12 h-12 rounded-full',
                                'bg-danger-100 dark:bg-danger-900/30',
                                'text-danger-600 dark:text-danger-400',
                                'hover:bg-danger-200 dark:hover:bg-danger-900/50',
                                'transition-colors duration-200'
                            )}
                            title="Emergency SOS"
                        >
                            <ShieldExclamationIcon className="h-6 w-6" />
                        </Link>
                    )}
                </div>

                {/* Mobile: sidebar content stacked above feed */}
                <div className="lg:hidden space-y-4">
                    {primaryBike && <PrimaryBikeWidget bike={primaryBike} />}
                    {sidebarEvents.length > 0 && (
                        <UpcomingEventsWidget events={sidebarEvents} />
                    )}
                </div>

                {/* Main grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main column - Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        {feedItems.length === 0 ? (
                            <EmptyState
                                title="Your feed is empty"
                                description="Join clubs, follow riders, and explore the community to see content here."
                                action={{
                                    label: 'Explore Clubs',
                                    onClick: () => router.visit(route('clubs.index')),
                                }}
                            />
                        ) : (
                            <>
                                {feedItems.map((item) => (
                                    <FeedCard key={item.id} item={item} />
                                ))}
                                {hasMore && (
                                    <div className="text-center pt-2 pb-4">
                                        <button
                                            onClick={loadMore}
                                            disabled={loadingMore}
                                            className={clsx(
                                                'inline-flex items-center gap-2 px-6 py-2.5 rounded-lg',
                                                'text-sm font-medium transition-colors',
                                                'bg-secondary-100 dark:bg-secondary-800',
                                                'text-secondary-700 dark:text-secondary-300',
                                                'hover:bg-secondary-200 dark:hover:bg-secondary-700',
                                                'disabled:opacity-50 disabled:cursor-not-allowed'
                                            )}
                                        >
                                            {loadingMore ? 'Loading...' : 'Load More'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar - desktop only */}
                    <div className="hidden lg:block space-y-4">
                        {primaryBike && <PrimaryBikeWidget bike={primaryBike} />}
                        <UpcomingEventsWidget events={sidebarEvents} />
                        <MyClubsWidget clubs={userClubs} />
                        <QuickActionsWidget hasSos={features?.sos !== false} />
                    </div>
                </div>

                {/* Mobile: bottom widgets */}
                <div className="lg:hidden space-y-4">
                    <MyClubsWidget clubs={userClubs} />
                    <QuickActionsWidget hasSos={features?.sos !== false} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
