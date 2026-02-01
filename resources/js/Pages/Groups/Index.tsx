import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Avatar, Badge, SearchBar, EmptyState, FloatingActionButton } from '@/Components/UI';
import { useState } from 'react';
import { PlusIcon, UserGroupIcon, MapPinIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Group {
    id: number;
    name: string;
    avatar?: string;
    description: string;
    membersCount: number;
    location: string;
    isJoined: boolean;
    lastActivity?: string;
}

interface GroupsIndexProps {
    myGroups?: Group[];
    discoverGroups?: Group[];
}

export default function GroupsIndex({
    myGroups = [],
    discoverGroups = [],
}: GroupsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMyGroups = myGroups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDiscoverGroups = discoverGroups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderGroupCard = (group: Group) => (
        <Link key={group.id} href={route('groups.show', group.id)}>
            <Card hoverable className="mb-3">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        {group.avatar ? (
                            <img
                                src={group.avatar}
                                alt={group.name}
                                className="w-14 h-14 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <UserGroupIcon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-secondary-900 dark:text-white truncate">
                                {group.name}
                            </h3>
                            {group.isJoined && (
                                <Badge variant="success" size="sm">
                                    Joined
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 line-clamp-1">
                            {group.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-secondary-400">
                            <span className="flex items-center gap-1">
                                <UserGroupIcon className="h-3.5 w-3.5" />
                                {group.membersCount} members
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPinIcon className="h-3.5 w-3.5" />
                                {group.location}
                            </span>
                        </div>
                    </div>
                    {group.isJoined && group.lastActivity && (
                        <div className="flex items-center text-xs text-secondary-400">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                            {group.lastActivity}
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );

    return (
        <AuthenticatedLayout header="Groups">
            <Head title="Groups" />

            <div className="space-y-6">
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                    placeholder="Search groups..."
                />

                {myGroups.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
                            My Groups
                        </h2>
                        {filteredMyGroups.length > 0 ? (
                            filteredMyGroups.map(renderGroupCard)
                        ) : (
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                No groups match your search
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
                        Discover Groups
                    </h2>
                    {filteredDiscoverGroups.length > 0 ? (
                        filteredDiscoverGroups.map(renderGroupCard)
                    ) : myGroups.length === 0 && discoverGroups.length === 0 ? (
                        <Card>
                            <EmptyState
                                icon={<UserGroupIcon className="h-8 w-8" />}
                                title="No groups yet"
                                description="Create a new group or wait for groups to appear in your area"
                                action={{
                                    label: 'Create Group',
                                    onClick: () => (window.location.href = route('groups.create')),
                                }}
                            />
                        </Card>
                    ) : (
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            No groups match your search
                        </p>
                    )}
                </div>
            </div>

            <FloatingActionButton
                icon={<PlusIcon className="h-6 w-6" />}
                onClick={() => (window.location.href = route('groups.create'))}
            />
        </AuthenticatedLayout>
    );
}
