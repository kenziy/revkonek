import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { SearchBar, EmptyState, FloatingActionButton, Badge } from '@/Components/UI';
import { useState } from 'react';
import clsx from 'clsx';
import { PlusIcon, UserGroupIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';
import { Club } from '@/types/club';

interface ClubsIndexProps {
    myClubs?: Club[];
    followedClubs?: Club[];
    discoverClubs?: Club[];
}

type TabKey = 'discover' | 'my' | 'following';

export default function ClubsIndex({
    myClubs = [],
    followedClubs = [],
    discoverClubs = [],
}: ClubsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabKey>('discover');

    const tabs: { key: TabKey; label: string; count: number }[] = [
        { key: 'discover', label: 'Discover', count: discoverClubs.length },
        { key: 'my', label: 'My Clubs', count: myClubs.length },
        { key: 'following', label: 'Following', count: followedClubs.length },
    ];

    const filterClubs = (clubs: Club[]) =>
        clubs.filter((club) =>
            club.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const renderClubCard = (club: Club) => (
        <Link key={club.id} href={route('clubs.show', club.slug)} className="block group">
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-secondary-800 shadow-sm hover:shadow-md transition-shadow border border-secondary-200 dark:border-secondary-700">
                {/* Cover */}
                <div className="h-32 sm:h-36 w-full overflow-hidden relative">
                    {club.cover_image ? (
                        <img
                            src={club.cover_image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Badges on cover */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        {club.is_premium && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-sm">
                                <SparklesIcon className="h-3 w-3" />
                                PRO
                            </span>
                        )}
                    </div>

                    {/* Members count on cover */}
                    <div className="absolute bottom-2.5 right-2.5">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm">
                            <UserGroupIcon className="h-3 w-3" />
                            {club.members_count ?? 0}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 -mt-6 relative">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl border-2 border-white dark:border-secondary-800 shadow-sm overflow-hidden bg-white dark:bg-secondary-700 flex-shrink-0">
                        {club.avatar ? (
                            <img
                                src={club.avatar}
                                alt={club.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <span className="text-lg font-bold text-white">
                                    {club.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-2">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-secondary-900 dark:text-white truncate">
                                {club.name}
                            </h3>
                            {club.is_verified && (
                                <CheckBadgeSolid className="h-4.5 w-4.5 text-primary-500 flex-shrink-0" />
                            )}
                        </div>
                        {club.description && (
                            <p className="text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2 mt-0.5">
                                {club.description}
                            </p>
                        )}
                        {club.city && (
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-secondary-400">
                                <MapPinIcon className="h-3.5 w-3.5" />
                                {club.city}{club.province ? `, ${club.province}` : ''}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

    const currentClubs = activeTab === 'my' ? myClubs : activeTab === 'following' ? followedClubs : discoverClubs;
    const filtered = filterClubs(currentClubs);

    return (
        <AuthenticatedLayout header="Clubs">
            <Head title="Clubs" />

            <div className="space-y-4">
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                    placeholder="Search clubs..."
                />

                {/* Tabs */}
                <div className="flex gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={clsx(
                                'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors',
                                activeTab === tab.key
                                    ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow-sm'
                                    : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700'
                            )}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="ml-1.5 text-xs text-secondary-400">
                                    ({tab.count})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Club grid */}
                <div>
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                            {filtered.map(renderClubCard)}
                        </div>
                    ) : currentClubs.length === 0 ? (
                        <div className="rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-8">
                            <EmptyState
                                icon={<UserGroupIcon className="h-8 w-8" />}
                                title={activeTab === 'my' ? 'No clubs yet' : activeTab === 'following' ? 'Not following any clubs' : 'No clubs to discover'}
                                description={activeTab === 'my' ? 'Create a new club or join one from the Discover tab' : activeTab === 'following' ? 'Follow clubs to see them here' : 'Be the first to create a club!'}
                                action={activeTab !== 'following' ? {
                                    label: 'Create Club',
                                    onClick: () => (window.location.href = route('clubs.create')),
                                } : undefined}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center py-8">
                            No clubs match your search
                        </p>
                    )}
                </div>
            </div>

            <FloatingActionButton
                icon={<PlusIcon className="h-6 w-6" />}
                onClick={() => (window.location.href = route('clubs.create'))}
            />
        </AuthenticatedLayout>
    );
}
