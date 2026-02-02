import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, Badge, ProgressBar } from '@/Components/UI';
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
    BoltIcon,
    TrophyIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

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
        hasJoinedGroup: boolean;
    };
    onboardingComplete: boolean;
    completedSteps: number;
    totalSteps: number;
    primaryBike?: {
        id: number;
        make: string;
        model: string;
        year: number;
        photo?: string;
    } | null;
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
    onboarding,
    onboardingComplete,
    completedSteps,
    totalSteps,
    primaryBike,
    stats = { totalChallenges: 0, wins: 0, rating: 0, streak: 0 },
}: DashboardProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const firstName = user?.name?.split(' ')[0] || 'Rider';

    const steps: OnboardingStep[] = [
        {
            key: 'hasBike',
            title: 'Add Your Bike',
            description: 'Tell us about your ride. This helps match you with similar riders.',
            icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
            href: route('garage.create'),
            buttonText: 'Add Bike',
            completed: onboarding.hasBike,
        },
        {
            key: 'hasEmergencyContact',
            title: 'Set Up Emergency Contacts',
            description: 'Add someone who can be notified in case of emergency.',
            icon: <ShieldExclamationIcon className="h-6 w-6" />,
            href: route('sos.contacts'),
            buttonText: 'Add Contact',
            completed: onboarding.hasEmergencyContact,
        },
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
            key: 'hasJoinedGroup',
            title: 'Join a Riding Group',
            description: 'Connect with local riders and join group rides.',
            icon: <UserGroupIcon className="h-6 w-6" />,
            href: route('groups.index'),
            buttonText: 'Find Groups',
            completed: onboarding.hasJoinedGroup,
        },
    ];

    // Find the current step (first incomplete step)
    const currentStepIndex = steps.findIndex(step => !step.completed);
    const currentStep = currentStepIndex !== -1 ? steps[currentStepIndex] : null;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    // Show onboarding view if not complete
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
                                            : index === currentStepIndex
                                              ? 'bg-primary-50 dark:bg-primary-900/20'
                                              : 'bg-secondary-50 dark:bg-secondary-800/50'
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                            step.completed
                                                ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
                                                : index === currentStepIndex
                                                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
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
                                    {!step.completed && index !== currentStepIndex && (
                                        <Badge variant="secondary" size="sm">
                                            Upcoming
                                        </Badge>
                                    )}
                                    {index === currentStepIndex && !step.completed && (
                                        <Link
                                            href={step.href}
                                            className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                                        >
                                            Start
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Skip for now link */}
                    <div className="text-center">
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            You can always complete these steps later from your profile.
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Regular dashboard for users who completed onboarding
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            Hey, {firstName}!
                        </h1>
                        <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">
                            Ready for your next ride?
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
                        title="Emergency SOS"
                    >
                        <ShieldExclamationIcon className="h-6 w-6" />
                    </Link>
                </div>

                {/* Primary Bike Card */}
                {primaryBike && (
                    <Link href={route('garage.show', primaryBike.id)}>
                        <Card variant="elevated" padding="none" hoverable className="overflow-hidden">
                            <div className="flex items-center gap-4 p-4">
                                <div className="w-20 h-20 rounded-lg bg-secondary-100 dark:bg-secondary-800 overflow-hidden flex-shrink-0">
                                    {primaryBike.photo ? (
                                        <img
                                            src={primaryBike.photo}
                                            alt={`${primaryBike.make} ${primaryBike.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <WrenchScrewdriverIcon className="h-8 w-8 text-secondary-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
                                        Your Ride
                                    </p>
                                    <h3 className="text-lg font-bold text-secondary-900 dark:text-white truncate">
                                        {primaryBike.year} {primaryBike.make} {primaryBike.model}
                                    </h3>
                                </div>
                                <ChevronRightIcon className="h-5 w-5 text-secondary-400 flex-shrink-0" />
                            </div>
                        </Card>
                    </Link>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href={route('challenges.index')}>
                        <Card hoverable className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 mx-auto mb-3 flex items-center justify-center">
                                <BoltIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                Challenges
                            </h3>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                                Race other riders
                            </p>
                        </Card>
                    </Link>
                    <Link href={route('match.index')}>
                        <Card hoverable className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-success-100 dark:bg-success-900/30 mx-auto mb-3 flex items-center justify-center">
                                <MapPinIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
                            </div>
                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                Find Riders
                            </h3>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                                Connect nearby
                            </p>
                        </Card>
                    </Link>
                    <Link href={route('groups.index')}>
                        <Card hoverable className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-warning-100 dark:bg-warning-900/30 mx-auto mb-3 flex items-center justify-center">
                                <UserGroupIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                            </div>
                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                Groups
                            </h3>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                                Join group rides
                            </p>
                        </Card>
                    </Link>
                    <Link href={route('shop.index')}>
                        <Card hoverable className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-info-100 dark:bg-info-900/30 mx-auto mb-3 flex items-center justify-center">
                                <RocketLaunchIcon className="h-6 w-6 text-info-600 dark:text-info-400" />
                            </div>
                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                Shop
                            </h3>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                                Parts & services
                            </p>
                        </Card>
                    </Link>
                </div>

                {/* Stats Summary */}
                <Card>
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                        Your Stats
                    </h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                                {stats.totalChallenges}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                Races
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                                {stats.wins}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                Wins
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                                {stats.rating.toFixed(1)}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                Rating
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {stats.streak}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                Streak
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
