import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, Avatar, Badge, EmptyState, ThemeToggle, ProBadge } from '@/Components/UI';
import { PublicProfileUser, PublicProfileVehicle, PublicProfileClub, FollowUser } from '@/types';
import { useState, useRef, PropsWithChildren } from 'react';
import clsx from 'clsx';
import {
    MapPinIcon,
    UserCircleIcon,
    CameraIcon,
    PencilIcon,
    TruckIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    WrenchScrewdriverIcon,
    InformationCircleIcon,
    SparklesIcon,
    UserPlusIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
            <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-lg border-b border-secondary-200 dark:border-secondary-700">
                <div className="flex h-full items-center justify-between px-4 lg:px-6 max-w-7xl mx-auto">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600">
                            <span className="text-white font-bold text-sm">RK</span>
                        </div>
                        <span className="font-bold text-lg text-secondary-900 dark:text-white">
                            REV KONEK
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href={route('login')}
                            className="px-4 py-2 text-sm font-semibold text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}

interface ShowProps {
    profileUser: PublicProfileUser;
    vehicles: PublicProfileVehicle[];
    clubs: PublicProfileClub[];
    isOwner: boolean;
    isGuest: boolean;
    isFollowing: boolean;
    followers: FollowUser[];
    followingUsers: FollowUser[];
}

type TabKey = 'garage' | 'clubs' | 'followers' | 'following' | 'about';

export default function ProfileShow({
    profileUser,
    vehicles,
    clubs,
    isOwner,
    isGuest,
    isFollowing: initialIsFollowing,
    followers,
    followingUsers,
}: ShowProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('garage');
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followProcessing, setFollowProcessing] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('cover_photo', file);
        router.post(route('profile.updateCoverPhoto'), formData as any, {
            forceFormData: true,
            onError: (errors) => {
                const msg = Object.values(errors).flat().join(' ');
                alert(msg || 'Failed to upload cover photo.');
            },
        });
        e.target.value = '';
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        router.post(route('profile.updateAvatar'), formData as any, {
            forceFormData: true,
            onError: (errors) => {
                const msg = Object.values(errors).flat().join(' ');
                alert(msg || 'Failed to upload photo.');
            },
        });
        e.target.value = '';
    };

    const handleFollowToggle = () => {
        if (followProcessing) return;
        setFollowProcessing(true);

        const routeName = isFollowing ? 'profile.unfollow' : 'profile.follow';
        router.post(route(routeName, profileUser.uuid), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsFollowing(!isFollowing);
                setFollowProcessing(false);
            },
            onError: () => setFollowProcessing(false),
        });
    };

    const handleVehicleLike = (vehicleUuid: string) => {
        router.post(route('vehicles.toggleLike', vehicleUuid), {}, {
            preserveScroll: true,
        });
    };

    const handleFollowUser = (uuid: string, currentlyFollowing: boolean) => {
        const routeName = currentlyFollowing ? 'profile.unfollow' : 'profile.follow';
        router.post(route(routeName, uuid), {}, {
            preserveScroll: true,
        });
    };

    const tabs: { key: TabKey; label: string; count?: number }[] = [
        { key: 'garage', label: 'Garage', count: vehicles.length },
        { key: 'clubs', label: 'Clubs', count: clubs.length },
        { key: 'followers', label: 'Followers', count: profileUser.followers_count },
        { key: 'following', label: 'Following', count: profileUser.following_count },
        { key: 'about', label: 'About' },
    ];

    const Layout = isGuest ? GuestLayout : AuthenticatedLayout;

    return (
        <Layout>
            <Head title={profileUser.display_name} />

            <div className={isGuest ? '' : '-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6'}>
                {/* Cover Photo + Avatar */}
                <div className="relative group">
                    <div className="h-48 sm:h-64 md:h-72 w-full overflow-visible bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                        <div className="h-full w-full overflow-hidden">
                            {profileUser.cover_photo ? (
                                <img
                                    src={profileUser.cover_photo}
                                    alt={`${profileUser.display_name} cover`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <UserCircleIcon className="h-16 w-16 text-white/20 mx-auto" />
                                        {isOwner && (
                                            <p className="text-white/40 text-sm mt-2">Add a cover photo</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Cover photo edit button */}
                    {isOwner && (
                        <>
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className={clsx(
                                    'absolute inset-0 bottom-0 flex items-center justify-center',
                                    'opacity-0 group-hover:opacity-100 transition-all',
                                )}
                            >
                                <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-white text-sm font-medium backdrop-blur-sm">
                                    <CameraIcon className="h-4 w-4" />
                                    {profileUser.cover_photo ? 'Edit Cover' : 'Add Cover Photo'}
                                </span>
                            </button>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverUpload}
                            />
                        </>
                    )}

                    {/* Avatar – centered over bottom of cover */}
                    <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 -translate-x-1/2 z-20 group/avatar">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-secondary-800 shadow-lg overflow-hidden bg-white dark:bg-secondary-700">
                            {profileUser.avatar ? (
                                <img
                                    src={profileUser.avatar}
                                    alt={profileUser.display_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                    <span className="text-3xl sm:text-4xl font-bold text-white">
                                        {profileUser.display_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        {isOwner && (
                            <>
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className={clsx(
                                        'absolute inset-0 rounded-full flex items-center justify-center',
                                        'bg-black/40 text-white transition-opacity',
                                        'opacity-0 group-hover/avatar:opacity-100'
                                    )}
                                >
                                    <CameraIcon className="h-6 w-6" />
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="relative bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 pt-16 sm:pt-18">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        {/* Centered Info */}
                        <div className="text-center pb-4">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
                                    {profileUser.display_name}
                                </h1>
                                {profileUser.is_premium && <ProBadge size="lg" />}
                            </div>
                            {profileUser.username && (
                                <p className="text-secondary-500 dark:text-secondary-400 mt-0.5">
                                    @{profileUser.username}
                                </p>
                            )}
                            <div className="flex items-center justify-center gap-1 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                <CalendarDaysIcon className="h-4 w-4" />
                                <span>Joined {profileUser.member_since}</span>
                            </div>
                            {(profileUser.city || profileUser.province) && (
                                <div className="flex items-center justify-center gap-1 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                    <MapPinIcon className="h-4 w-4" />
                                    {[profileUser.city, profileUser.province].filter(Boolean).join(', ')}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center gap-2 mt-3">
                                {isGuest ? (
                                    <Link
                                        href={route('login')}
                                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                                    >
                                        Log in to Connect
                                    </Link>
                                ) : isOwner ? (
                                    <Link
                                        href={route('profile.edit')}
                                        className="px-4 py-2.5 bg-white border border-secondary-300 text-secondary-700 dark:bg-secondary-700 dark:border-secondary-600 dark:text-secondary-300 rounded-xl font-semibold text-sm transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-600 flex items-center gap-1.5 shadow-sm"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit Profile
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleFollowToggle}
                                        disabled={followProcessing}
                                        className={clsx(
                                            'px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5',
                                            isFollowing
                                                ? 'bg-white border border-secondary-300 text-secondary-700 dark:bg-secondary-700 dark:border-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600'
                                                : 'bg-primary-600 hover:bg-primary-500 text-white',
                                            followProcessing && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        {isFollowing ? (
                                            <>
                                                <UsersIcon className="h-4 w-4" />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <UserPlusIcon className="h-4 w-4" />
                                                Follow
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex justify-center gap-0 -mb-px overflow-x-auto scrollbar-none">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={clsx(
                                        'px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                                        activeTab === tab.key
                                            ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                                            : 'border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 hover:border-secondary-300'
                                    )}
                                >
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className="ml-1.5 text-xs text-secondary-400 font-normal">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

                    {/* Garage Tab */}
                    {activeTab === 'garage' && (
                        <div>
                            {vehicles.length === 0 ? (
                                <EmptyState
                                    icon={<TruckIcon className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />}
                                    title="No vehicles yet"
                                    description={isOwner ? 'Add your first vehicle to showcase your ride.' : 'This rider hasn\'t added any vehicles yet.'}
                                    action={isOwner ? { label: 'Add Vehicle', onClick: () => router.visit(route('vehicles.create')) } : undefined}
                                />
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vehicles.map((vehicle) => (
                                        <Card key={vehicle.uuid} padding="none" className="overflow-hidden hover:shadow-md transition-shadow">
                                            <Link href={route('vehicles.show', vehicle.uuid)}>
                                                <div className="aspect-[4/3] bg-secondary-100 dark:bg-secondary-700 overflow-hidden relative">
                                                    {vehicle.photo ? (
                                                        <img
                                                            src={vehicle.photo}
                                                            alt={vehicle.displayName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <TruckIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-secondary-900 dark:text-white truncate">
                                                            {vehicle.displayName}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                                            {vehicle.engineSpec && (
                                                                <span>{vehicle.engineSpec}</span>
                                                            )}
                                                            {vehicle.engineSpec && vehicle.color && (
                                                                <span className="text-secondary-300">·</span>
                                                            )}
                                                            {vehicle.color && <span>{vehicle.color}</span>}
                                                        </div>
                                                    </div>
                                                    {!isGuest && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleVehicleLike(vehicle.uuid);
                                                            }}
                                                            className="flex items-center gap-1 text-sm shrink-0 group/heart"
                                                        >
                                                            {vehicle.isLiked ? (
                                                                <HeartIconSolid className="h-5 w-5 text-red-500" />
                                                            ) : (
                                                                <HeartIconOutline className="h-5 w-5 text-secondary-400 group-hover/heart:text-red-500 transition-colors" />
                                                            )}
                                                            {vehicle.likesCount > 0 && (
                                                                <span className="text-secondary-500 dark:text-secondary-400">{vehicle.likesCount}</span>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    {vehicle.category && (
                                                        <Badge variant="primary" size="sm">{vehicle.category}</Badge>
                                                    )}
                                                    {vehicle.modificationLevel && vehicle.modificationLevel !== 'stock' && (
                                                        <Badge variant="secondary" size="sm">
                                                            <WrenchScrewdriverIcon className="h-3 w-3 -ml-0.5" />
                                                            {vehicle.modificationLevel}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Clubs Tab */}
                    {activeTab === 'clubs' && (
                        <div>
                            {clubs.length === 0 ? (
                                <EmptyState
                                    icon={<UserGroupIcon className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />}
                                    title="No clubs yet"
                                    description={isOwner ? 'Join a club to connect with other riders.' : 'This rider hasn\'t joined any clubs yet.'}
                                    action={isOwner ? { label: 'Browse Clubs', onClick: () => router.visit(route('clubs.index')) } : undefined}
                                />
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {clubs.map((club) => (
                                        <Link key={club.slug} href={route('clubs.show', club.slug)}>
                                            <Card padding="lg" className="hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-4">
                                                    <Avatar
                                                        src={club.avatar}
                                                        name={club.name}
                                                        size="lg"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-secondary-900 dark:text-white truncate">
                                                                {club.name}
                                                            </h3>
                                                            {club.is_premium && (
                                                                <Badge variant="warning" size="sm">
                                                                    <SparklesIcon className="h-3 w-3 -ml-0.5" />
                                                                    PRO
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                                            <span>{club.members_count} members</span>
                                                            <span className="text-secondary-300">·</span>
                                                            <Badge variant="secondary" size="sm">{club.role}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Followers Tab */}
                    {activeTab === 'followers' && (
                        <div>
                            {followers.length === 0 ? (
                                <EmptyState
                                    icon={<UsersIcon className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />}
                                    title="No followers yet"
                                    description={isOwner ? 'Share your profile to get followers.' : 'This rider doesn\'t have any followers yet.'}
                                />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {followers.map((user) => (
                                        <FollowUserCard
                                            key={user.uuid}
                                            user={user}
                                            isGuest={isGuest}
                                            onFollowToggle={handleFollowUser}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Following Tab */}
                    {activeTab === 'following' && (
                        <div>
                            {followingUsers.length === 0 ? (
                                <EmptyState
                                    icon={<UsersIcon className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />}
                                    title="Not following anyone"
                                    description={isOwner ? 'Follow other riders to see them here.' : 'This rider isn\'t following anyone yet.'}
                                />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {followingUsers.map((user) => (
                                        <FollowUserCard
                                            key={user.uuid}
                                            user={user}
                                            isGuest={isGuest}
                                            onFollowToggle={handleFollowUser}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card padding="lg">
                                <h3 className="font-semibold text-secondary-900 dark:text-white mb-3 flex items-center gap-2">
                                    <InformationCircleIcon className="h-5 w-5 text-secondary-400" />
                                    About
                                </h3>
                                {profileUser.bio ? (
                                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                                        {profileUser.bio}
                                    </p>
                                ) : (
                                    <p className="text-sm text-secondary-400 italic">
                                        {isOwner ? 'Add a bio to tell others about yourself.' : 'No bio yet.'}
                                    </p>
                                )}

                                <div className="mt-4 space-y-3">
                                    {(profileUser.city || profileUser.province) && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <MapPinIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                            <span className="text-secondary-700 dark:text-secondary-300">
                                                {[profileUser.city, profileUser.province].filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {profileUser.riding_style && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <TruckIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                            <span className="text-secondary-700 dark:text-secondary-300 capitalize">
                                                {profileUser.riding_style} rider
                                            </span>
                                        </div>
                                    )}
                                    {profileUser.riding_experience_years !== undefined && profileUser.riding_experience_years > 0 && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <CalendarDaysIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                            <span className="text-secondary-700 dark:text-secondary-300">
                                                {profileUser.riding_experience_years} {profileUser.riding_experience_years === 1 ? 'year' : 'years'} riding
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm">
                                        <CalendarDaysIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                        <span className="text-secondary-700 dark:text-secondary-300">
                                            Member since {profileUser.member_since}
                                        </span>
                                    </div>
                                </div>

                                {isOwner && (
                                    <Link
                                        href={route('profile.edit')}
                                        className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit Profile
                                    </Link>
                                )}
                            </Card>

                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

function FollowUserCard({
    user,
    isGuest,
    onFollowToggle,
}: {
    user: FollowUser;
    isGuest: boolean;
    onFollowToggle: (uuid: string, isFollowing: boolean) => void;
}) {
    return (
        <Card padding="lg" className="hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
                <Link href={route('profile.show', user.uuid)}>
                    <Avatar
                        src={user.avatar}
                        name={user.display_name}
                        size="xl"
                    />
                </Link>
                <div className="min-w-0 w-full">
                    <div className="flex items-center justify-center gap-1.5">
                        <Link
                            href={route('profile.show', user.uuid)}
                            className="font-semibold text-secondary-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            {user.display_name}
                        </Link>
                        {user.is_premium && <ProBadge size="sm" />}
                    </div>
                    {user.username && (
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            @{user.username}
                        </p>
                    )}
                </div>
                {!isGuest && !user.isOwn && (
                    <button
                        onClick={() => onFollowToggle(user.uuid, user.isFollowing)}
                        className={clsx(
                            'w-full px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
                            user.isFollowing
                                ? 'bg-white border border-secondary-300 text-secondary-700 dark:bg-secondary-700 dark:border-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600'
                                : 'bg-primary-600 hover:bg-primary-500 text-white'
                        )}
                    >
                        {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>
        </Card>
    );
}
