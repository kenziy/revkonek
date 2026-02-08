import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Card, Avatar, Badge, StatCard, ProgressBar, EmptyState, ThemeToggle } from '@/Components/UI';
import { Club, ClubMember, ClubPost, ClubEvent, ClubPhoto, ClubGarageVehicle, ClubGarageStats, CLUB_ROLE_RANKS, CLUB_ROLE_LABELS, CLUB_ROLE_COLORS } from '@/types/club';
import { useState, useMemo, FormEvent, useRef, PropsWithChildren } from 'react';
import clsx from 'clsx';
import {
    UserGroupIcon,
    MapPinIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    CheckBadgeIcon,
    PencilIcon,
    HeartIcon,
    CameraIcon,
    PhotoIcon,
    GlobeAltIcon,
    LockClosedIcon,
    EyeSlashIcon,
    ClockIcon,
    DocumentTextIcon,
    TrashIcon,
    EllipsisHorizontalIcon,
    InformationCircleIcon,
    SparklesIcon,
    XMarkIcon,
    TruckIcon,
    FireIcon,
    BoltIcon,
    WrenchScrewdriverIcon,
    LinkIcon,
    SignalIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, CheckBadgeIcon as CheckBadgeSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

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
    club: Club & { posts_count?: number; events_count?: number; photos_count?: number };
    membership?: ClubMember | null;
    isFollowing: boolean;
    isGuest?: boolean;
    pendingRequest?: boolean;
    posts: { data: ClubPost[] };
    upcomingEvents: ClubEvent[];
    recentMembers: ClubMember[];
    photos: ClubPhoto[];
    garageVehicles: ClubGarageVehicle[];
    garageStats: ClubGarageStats;
    memberPoints: { id: number; name: string; avatar?: string; points: number }[];
}

type TabKey = 'feed' | 'garage' | 'events' | 'members' | 'photos' | 'about';

export default function ClubShow({
    club,
    membership,
    isFollowing,
    isGuest = false,
    pendingRequest = false,
    posts,
    upcomingEvents,
    recentMembers,
    photos,
    garageVehicles = [],
    garageStats = { totalVehicles: 0, totalCC: 0, avgCC: 0, categoryBreakdown: {} },
    memberPoints = [],
}: ShowProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('feed');
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);
    const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
    const [garageFilter, setGarageFilter] = useState<string>('All');
    const isMember = !!membership;
    const myRank = membership ? CLUB_ROLE_RANKS[membership.role] : 99;
    const isLeadership = membership && myRank <= 2; // president or VP
    const isOfficer = membership && membership.role !== 'member';
    const canManage = isOfficer;

    const coverInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const postForm = useForm({ content: '', visibility: 'public' });
    const photoForm = useForm<{ photos: File[] }>({ photos: [] });
    const photoInputRef = useRef<HTMLInputElement>(null);

    const submitPost = (e: FormEvent) => {
        e.preventDefault();
        postForm.post(route('clubs.posts.store', club.slug), {
            onSuccess: () => postForm.reset(),
        });
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('cover_image', file);
        router.post(route('clubs.updateCoverImage', club.slug), formData as any, {
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
        router.post(route('clubs.updateAvatar', club.slug), formData as any, {
            forceFormData: true,
            onError: (errors) => {
                const msg = Object.values(errors).flat().join(' ');
                alert(msg || 'Failed to upload logo.');
            },
        });
        e.target.value = '';
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('photos[]', file));
        router.post(route('clubs.photos.store', club.slug), formData as any, {
            forceFormData: true,
            onSuccess: () => setShowPhotoUpload(false),
        });
    };

    const typeConfig = {
        public: {
            icon: GlobeAltIcon,
            label: 'Public Club',
            desc: club.requires_approval ? 'Anyone can see \u2022 Approval required to join' : 'Anyone can see and join',
        },
        private: { icon: LockClosedIcon, label: 'Private Club', desc: 'Must request to join' },
        secret: { icon: EyeSlashIcon, label: 'Secret Club', desc: 'Invite only' },
    };

    const clubType = typeConfig[club.type] || typeConfig.public;

    const filteredGarageVehicles = useMemo(() => {
        if (garageFilter === 'All') return garageVehicles;
        return garageVehicles.filter((v) => (v.category?.name ?? 'Other') === garageFilter);
    }, [garageVehicles, garageFilter]);

    const tabs: { key: TabKey; label: string; count?: number }[] = [
        { key: 'feed', label: 'Posts', count: club.posts_count },
        { key: 'garage', label: 'Garage', count: garageStats.totalVehicles || undefined },
        { key: 'events', label: 'Events', count: club.events_count },
        { key: 'members', label: 'Members', count: club.members_count },
        { key: 'photos', label: 'Photos', count: club.photos_count },
        { key: 'about', label: 'About' },
    ];

    const Layout = isGuest ? GuestLayout : AuthenticatedLayout;

    return (
        <Layout>
            <Head title={club.name} />

            <div className={isGuest ? '' : '-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6'}>
                {/* ── Cover Photo + Avatar ── */}
                <div className="relative group">
                    <div className="h-48 sm:h-64 md:h-80 w-full overflow-visible bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                        <div className="h-full w-full overflow-hidden">
                            {club.cover_image ? (
                                <img
                                    src={club.cover_image}
                                    alt={`${club.name} cover`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <UserGroupIcon className="h-16 w-16 text-white/20 mx-auto" />
                                        {isLeadership && (
                                            <p className="text-white/40 text-sm mt-2">Add a cover photo</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Cover photo edit button */}
                    {isLeadership && (
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
                                    {club.cover_image ? 'Edit Cover' : 'Add Cover Photo'}
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

                    {/* Avatar – overlaps bottom of cover */}
                    <div className="absolute -bottom-6 sm:-bottom-8 left-4 sm:left-6 lg:left-[calc((100%-64rem)/2+1.5rem)] z-20 group/avatar">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-secondary-800 shadow-lg overflow-hidden bg-white dark:bg-secondary-700">
                            {club.avatar ? (
                                <img
                                    src={club.avatar}
                                    alt={club.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                    <span className="text-3xl sm:text-4xl font-bold text-white">
                                        {club.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        {isLeadership && (
                            <>
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className={clsx(
                                        'absolute inset-0 rounded-2xl flex items-center justify-center',
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

                {/* ── Profile Section ── */}
                <div className="relative bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 pt-10 sm:pt-12">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        {/* Club Info Row */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 pb-4">

                            {/* Club info */}
                            <div className="flex-1 min-w-0 pb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
                                        {club.name}
                                    </h1>
                                    {club.is_verified && (
                                        <CheckBadgeSolid className="h-6 w-6 text-primary-500 flex-shrink-0" />
                                    )}
                                    {club.is_premium && (
                                        <Badge variant="warning" size="sm">
                                            <SparklesIcon className="h-3 w-3 -ml-0.5" />
                                            PRO
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-sm text-secondary-500 dark:text-secondary-400 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <clubType.icon className="h-4 w-4" />
                                        {clubType.label}
                                    </span>
                                    {club.city && (
                                        <span className="flex items-center gap-1">
                                            <MapPinIcon className="h-4 w-4" />
                                            {club.city}{club.province ? `, ${club.province}` : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0 pb-1">
                                {isGuest ? (
                                    <Link
                                        href={route('login')}
                                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                                    >
                                        Log in to Join
                                    </Link>
                                ) : !isMember ? (
                                    <>
                                        {pendingRequest ? (
                                            <button
                                                disabled
                                                className="px-5 py-2.5 bg-secondary-400 text-white rounded-xl font-semibold text-sm cursor-not-allowed shadow-sm"
                                            >
                                                Request Pending
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => router.post(route('clubs.join', club.slug))}
                                                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                                            >
                                                {club.type === 'private' || club.requires_approval ? 'Request to Join' : 'Join Club'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => router.post(route(isFollowing ? 'clubs.unfollow' : 'clubs.follow', club.slug))}
                                            className={clsx(
                                                'px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors border shadow-sm',
                                                isFollowing
                                                    ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400'
                                                    : 'bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-50 dark:bg-secondary-700 dark:border-secondary-600 dark:text-secondary-300'
                                            )}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                {isFollowing ? (
                                                    <HeartIconSolid className="h-4 w-4 text-primary-500" />
                                                ) : (
                                                    <HeartIcon className="h-4 w-4" />
                                                )}
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {isLeadership && (
                                            <Link
                                                href={route('clubs.edit', club.slug)}
                                                className="px-4 py-2.5 bg-white border border-secondary-300 text-secondary-700 dark:bg-secondary-700 dark:border-secondary-600 dark:text-secondary-300 rounded-xl font-semibold text-sm transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-600 flex items-center gap-1.5 shadow-sm"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                                Edit
                                            </Link>
                                        )}
                                        {isLeadership && (
                                            <Link
                                                href={route('clubs.settings', club.slug)}
                                                className="px-4 py-2.5 bg-white border border-secondary-300 text-secondary-700 dark:bg-secondary-700 dark:border-secondary-600 dark:text-secondary-300 rounded-xl font-semibold text-sm transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-600 flex items-center gap-1.5 shadow-sm"
                                            >
                                                <Cog6ToothIcon className="h-4 w-4" />
                                                Settings
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => router.post(route('clubs.leave', club.slug))}
                                            className="px-4 py-2.5 border border-secondary-300 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 rounded-xl text-sm transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-700"
                                        >
                                            Leave
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex items-center gap-6 py-3 border-t border-secondary-100 dark:border-secondary-700 text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-secondary-900 dark:text-white">{club.members_count ?? 0}</span>
                                <span className="text-secondary-500 dark:text-secondary-400">Members</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-secondary-900 dark:text-white">{club.followers_count ?? 0}</span>
                                <span className="text-secondary-500 dark:text-secondary-400">Followers</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-secondary-900 dark:text-white">{club.posts_count ?? 0}</span>
                                <span className="text-secondary-500 dark:text-secondary-400">Posts</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-secondary-900 dark:text-white">{club.events_count ?? 0}</span>
                                <span className="text-secondary-500 dark:text-secondary-400">Events</span>
                            </div>

                            {/* Member avatars */}
                            {recentMembers.length > 0 && (
                                <div className="hidden sm:flex items-center gap-1 ml-auto">
                                    <div className="flex -space-x-2">
                                        {recentMembers.slice(0, 5).map((m) => (
                                            <Avatar
                                                key={m.id}
                                                src={m.user?.avatar}
                                                name={m.user?.display_name}
                                                size="xs"
                                                rounded="full"
                                            />
                                        ))}
                                    </div>
                                    {(club.members_count ?? 0) > 5 && (
                                        <span className="text-xs text-secondary-400 ml-1">
                                            +{(club.members_count ?? 0) - 5}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-none">
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
                                    {tab.count !== undefined && tab.count > 0 && (
                                        <span className="ml-1.5 text-xs text-secondary-400 font-normal">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tab Content ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

                    {/* Feed Tab */}
                    {activeTab === 'feed' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Sidebar */}
                            <div className="space-y-4 lg:col-span-1 order-2 lg:order-1">
                                {/* About Card */}
                                <Card padding="lg">
                                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-3 flex items-center gap-2">
                                        <InformationCircleIcon className="h-5 w-5 text-secondary-400" />
                                        About
                                    </h3>
                                    {club.description ? (
                                        <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                                            {club.description}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-secondary-400 italic">No description yet.</p>
                                    )}
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <clubType.icon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                            <div>
                                                <span className="text-secondary-700 dark:text-secondary-300 font-medium">{clubType.label}</span>
                                                <span className="text-secondary-400 block text-xs">{clubType.desc}</span>
                                            </div>
                                        </div>
                                        {club.city && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <MapPinIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                                <span className="text-secondary-700 dark:text-secondary-300">
                                                    {club.city}{club.province ? `, ${club.province}` : ''}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-sm">
                                            <ClockIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                            <span className="text-secondary-700 dark:text-secondary-300">
                                                Created {new Date(club.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        {club.owner && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <UserGroupIcon className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                                                <span className="text-secondary-700 dark:text-secondary-300">
                                                    Founded by <strong>{club.owner.display_name}</strong>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Recent Photos Sidebar */}
                                {photos.length > 0 && (
                                    <Card padding="lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                                                <PhotoIcon className="h-5 w-5 text-secondary-400" />
                                                Photos
                                            </h3>
                                            <button
                                                onClick={() => setActiveTab('photos')}
                                                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                            >
                                                See All
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
                                            {photos.slice(0, 6).map((photo) => (
                                                <button
                                                    key={photo.id}
                                                    onClick={() => setLightboxPhoto(photo.path)}
                                                    className="aspect-square overflow-hidden hover:opacity-80 transition-opacity"
                                                >
                                                    <img
                                                        src={photo.path}
                                                        alt={photo.caption || ''}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </Card>
                                )}

                                {/* Members Sidebar */}
                                <Card padding="lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                                            <UserGroupIcon className="h-5 w-5 text-secondary-400" />
                                            Members
                                            <span className="text-xs text-secondary-400 font-normal">
                                                {club.members_count ?? 0}
                                            </span>
                                        </h3>
                                        <button
                                            onClick={() => setActiveTab('members')}
                                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                        >
                                            See All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {recentMembers.slice(0, 8).map((m) => (
                                            <Link
                                                key={m.id}
                                                href={m.user?.uuid ? route('profile.show', m.user.uuid) : '#'}
                                                className="text-center hover:opacity-80 transition-opacity"
                                            >
                                                <Avatar
                                                    src={m.user?.avatar}
                                                    name={m.user?.display_name}
                                                    size="md"
                                                    rounded="lg"
                                                />
                                                <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1 truncate">
                                                    {m.user?.display_name?.split(' ')[0]}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>

                                {/* Club Stats Widget */}
                                {garageStats.totalVehicles > 0 && (
                                    <Card padding="lg">
                                        <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2 mb-3">
                                            <BoltIcon className="h-5 w-5 text-secondary-400" />
                                            Club Stats
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-secondary-500 dark:text-secondary-400">Total Fleet Power</span>
                                                <span className="font-semibold text-secondary-900 dark:text-white">{garageStats.totalCC.toLocaleString()}cc</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-secondary-500 dark:text-secondary-400">Fleet Size</span>
                                                <span className="font-semibold text-secondary-900 dark:text-white">{garageStats.totalVehicles} vehicles</span>
                                            </div>
                                            {garageStats.topCategory && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-secondary-500 dark:text-secondary-400">Top Category</span>
                                                    <Badge variant="primary" size="sm">{garageStats.topCategory}</Badge>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm">
                                                <span className="text-secondary-500 dark:text-secondary-400">Avg Engine</span>
                                                <span className="font-semibold text-secondary-900 dark:text-white">{garageStats.avgCC}cc</span>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Most Active Members Widget */}
                                {memberPoints.length > 0 && (
                                    <Card padding="lg">
                                        <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2 mb-3">
                                            <FireIcon className="h-5 w-5 text-accent-500" />
                                            Most Active
                                        </h3>
                                        <div className="space-y-3">
                                            {memberPoints.map((mp) => (
                                                <div key={mp.id} className="flex items-center gap-3">
                                                    <Avatar src={mp.avatar} name={mp.name} size="sm" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">{mp.name}</p>
                                                    </div>
                                                    <span className="text-xs text-accent-500 font-semibold">{mp.points} pts</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </div>

                            {/* Main Feed */}
                            <div className="space-y-4 lg:col-span-2 order-1 lg:order-2">
                                {/* Post composer */}
                                {!isGuest && isMember && (
                                    <Card padding="lg">
                                        <form onSubmit={submitPost}>
                                            <div className="flex items-start gap-3">
                                                <Avatar
                                                    src={(usePage().props as any).auth?.user?.avatar}
                                                    name={(usePage().props as any).auth?.user?.display_name}
                                                    size="md"
                                                />
                                                <div className="flex-1">
                                                    <textarea
                                                        value={postForm.data.content}
                                                        onChange={(e) => postForm.setData('content', e.target.value)}
                                                        rows={3}
                                                        className="w-full rounded-xl border-secondary-200 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white focus:ring-primary-500 focus:border-primary-500 resize-none text-sm placeholder:text-secondary-400"
                                                        placeholder="Share something with the club..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                                                {club.is_premium && (
                                                    <select
                                                        value={postForm.data.visibility}
                                                        onChange={(e) => postForm.setData('visibility', e.target.value)}
                                                        className="text-sm rounded-lg border-secondary-200 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white py-1.5"
                                                    >
                                                        <option value="public">Public</option>
                                                        <option value="members_only">Members Only</option>
                                                    </select>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={postForm.processing || !postForm.data.content.trim()}
                                                    className="ml-auto px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </form>
                                    </Card>
                                )}

                                {/* Posts */}
                                {posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <Card key={post.id} padding="lg">
                                            <div className="flex items-start gap-3">
                                                <Avatar
                                                    src={post.user?.avatar}
                                                    name={post.user?.display_name}
                                                    size="md"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-secondary-900 dark:text-white text-sm">
                                                            {post.user?.display_name}
                                                        </span>
                                                        {post.is_pinned && (
                                                            <Badge variant="warning" size="sm">Pinned</Badge>
                                                        )}
                                                        {post.is_announcement && (
                                                            <Badge variant="primary" size="sm">Announcement</Badge>
                                                        )}
                                                        {post.visibility === 'members_only' && (
                                                            <Badge variant="secondary" size="sm">
                                                                <LockClosedIcon className="h-3 w-3" />
                                                                Members
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-secondary-400">
                                                        {formatTimeAgo(post.created_at)}
                                                    </span>
                                                    <p className="text-secondary-700 dark:text-secondary-300 mt-2 text-sm whitespace-pre-wrap leading-relaxed">
                                                        {post.content}
                                                    </p>
                                                </div>
                                                {canManage && (
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        {!post.is_pinned ? (
                                                            <button
                                                                onClick={() => router.post(route('clubs.posts.pin', [club.slug, post.id]))}
                                                                className="p-1.5 text-secondary-400 hover:text-accent-500 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                                                                title="Pin post"
                                                            >
                                                                <MapPinIcon className="h-4 w-4" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => router.post(route('clubs.posts.unpin', [club.slug, post.id]))}
                                                                className="p-1.5 text-accent-500 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                                                                title="Unpin post"
                                                            >
                                                                <MapPinIcon className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Delete this post?')) {
                                                                    router.delete(route('clubs.posts.destroy', [club.slug, post.id]));
                                                                }
                                                            }}
                                                            className="p-1.5 text-secondary-400 hover:text-danger-500 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                                                            title="Delete post"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <Card padding="lg">
                                        <div className="text-center py-12">
                                            <DocumentTextIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" />
                                            <h3 className="font-semibold text-secondary-900 dark:text-white">No posts yet</h3>
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                                {isMember ? 'Be the first to share something!' : 'Join the club to start posting.'}
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Garage Tab */}
                    {activeTab === 'garage' && (
                        <div className="max-w-5xl mx-auto space-y-6">
                            {/* Garage Stats Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <StatCard
                                    title="Total Vehicles"
                                    value={garageStats.totalVehicles}
                                    icon={<TruckIcon className="h-5 w-5" />}
                                />
                                <StatCard
                                    title="Combined CC"
                                    value={`${garageStats.totalCC.toLocaleString()}cc`}
                                    icon={<BoltIcon className="h-5 w-5" />}
                                    variant="primary"
                                />
                                <StatCard
                                    title="Avg Engine"
                                    value={`${garageStats.avgCC}cc`}
                                    icon={<WrenchScrewdriverIcon className="h-5 w-5" />}
                                />
                                <StatCard
                                    title="Top Category"
                                    value={garageStats.topCategory ?? 'N/A'}
                                    icon={<StarIconSolid className="h-5 w-5" />}
                                    variant="warning"
                                />
                            </div>

                            {/* Category Filter Pills */}
                            {Object.keys(garageStats.categoryBreakdown).length > 1 && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setGarageFilter('All')}
                                        className={clsx(
                                            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                            garageFilter === 'All'
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                                        )}
                                    >
                                        All ({garageStats.totalVehicles})
                                    </button>
                                    {Object.entries(garageStats.categoryBreakdown).map(([cat, count]) => (
                                        <button
                                            key={cat}
                                            onClick={() => setGarageFilter(cat)}
                                            className={clsx(
                                                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                                garageFilter === cat
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                                            )}
                                        >
                                            {cat} ({count})
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Vehicle Grid */}
                            {filteredGarageVehicles.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredGarageVehicles.map((vehicle) => (
                                        <Card key={vehicle.id} padding="none" className="overflow-hidden">
                                            <div className="aspect-[4/3] bg-secondary-100 dark:bg-secondary-700 relative">
                                                {vehicle.primary_photo ? (
                                                    <img
                                                        src={`/storage/${vehicle.primary_photo.path}`}
                                                        alt={vehicle.display_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <TruckIcon className="h-10 w-10 text-secondary-300 dark:text-secondary-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <div className="flex flex-wrap gap-1 mb-1.5">
                                                    {vehicle.category && (
                                                        <Badge variant="primary" size="sm">{vehicle.category.name}</Badge>
                                                    )}
                                                    {vehicle.modification_level && vehicle.modification_level !== 'stock' && (
                                                        <Badge variant="warning" size="sm">{vehicle.modification_level}</Badge>
                                                    )}
                                                </div>
                                                <p className="font-semibold text-sm text-secondary-900 dark:text-white truncate">
                                                    {vehicle.display_name}
                                                </p>
                                                {vehicle.bike_details?.cc && (
                                                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{vehicle.bike_details.cc}cc</p>
                                                )}
                                                {vehicle.user && (
                                                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-secondary-100 dark:border-secondary-700">
                                                        <Avatar name={vehicle.user.name} size="xs" />
                                                        <span className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{vehicle.user.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<TruckIcon className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />}
                                    title="No vehicles in the club garage yet"
                                    description="Members' active vehicles will appear here."
                                />
                            )}
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className="max-w-3xl mx-auto space-y-4">
                            {canManage && (
                                <Link
                                    href={route('clubs.events.create', club.slug)}
                                    className="flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm transition-colors"
                                >
                                    <CalendarDaysIcon className="h-5 w-5" />
                                    Create Event
                                </Link>
                            )}
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => {
                                    const eventBadge = {
                                        ride: { variant: 'primary' as const, icon: TruckIcon },
                                        meetup: { variant: 'success' as const, icon: UserGroupIcon },
                                        track_day: { variant: 'warning' as const, icon: FireIcon },
                                        workshop: { variant: 'info' as const, icon: WrenchScrewdriverIcon },
                                    }[event.type] ?? { variant: 'secondary' as const, icon: CalendarDaysIcon };

                                    const duration = event.ends_at
                                        ? (() => {
                                              const hours = Math.round((new Date(event.ends_at).getTime() - new Date(event.starts_at).getTime()) / 3600000);
                                              return hours > 0 ? `${hours}h ${event.type === 'ride' ? 'ride' : 'event'}` : null;
                                          })()
                                        : null;

                                    const spotsLeft = event.max_attendees && event.rsvps_count !== undefined
                                        ? event.max_attendees - event.rsvps_count
                                        : null;

                                    return (
                                        <Link key={event.id} href={route('clubs.events.show', [club.slug, event.id])}>
                                            <Card hoverable padding="lg" className="mb-3">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center">
                                                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase leading-none">
                                                            {new Date(event.starts_at).toLocaleDateString('en', { month: 'short' })}
                                                        </span>
                                                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400 leading-none">
                                                            {new Date(event.starts_at).getDate()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                                                {event.title}
                                                            </h3>
                                                            <Badge variant={eventBadge.variant} size="sm">
                                                                <eventBadge.icon className="h-3 w-3 -ml-0.5" />
                                                                {event.type.replace('_', ' ')}
                                                            </Badge>
                                                        </div>
                                                        {event.location_name && (
                                                            <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1 mt-1">
                                                                <MapPinIcon className="h-3.5 w-3.5" />
                                                                {event.location_name}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                                                            <p className="text-xs text-secondary-400">
                                                                {new Date(event.starts_at).toLocaleDateString('en', {
                                                                    weekday: 'long',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                            {duration && (
                                                                <span className="text-xs text-secondary-400 flex items-center gap-1">
                                                                    <ClockIcon className="h-3 w-3" />
                                                                    {duration}
                                                                </span>
                                                            )}
                                                            {event.rsvps_count !== undefined && (
                                                                <span className="text-xs text-secondary-400">{event.rsvps_count} attending</span>
                                                            )}
                                                        </div>

                                                        {/* Capacity bar */}
                                                        {event.max_attendees && event.rsvps_count !== undefined && (
                                                            <div className="mt-2">
                                                                <ProgressBar
                                                                    value={event.rsvps_count}
                                                                    max={event.max_attendees}
                                                                    variant={spotsLeft !== null && spotsLeft < 5 ? 'warning' : 'primary'}
                                                                    size="sm"
                                                                    label={`${event.rsvps_count}/${event.max_attendees} spots${spotsLeft !== null && spotsLeft < 5 ? ` (${spotsLeft} left!)` : ''}`}
                                                                    showLabel
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Route link */}
                                                        {event.route_link && (
                                                            <a
                                                                href={event.route_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline mt-2 font-medium"
                                                            >
                                                                <LinkIcon className="h-3.5 w-3.5" />
                                                                View Route Map
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    );
                                })
                            ) : (
                                <Card padding="lg">
                                    <div className="text-center py-12">
                                        <CalendarDaysIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" />
                                        <h3 className="font-semibold text-secondary-900 dark:text-white">No upcoming events</h3>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                            {canManage ? 'Create an event to get things started.' : 'Check back later for events.'}
                                        </p>
                                    </div>
                                </Card>
                            )}
                            <Link
                                href={route('clubs.events', club.slug)}
                                className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline py-2"
                            >
                                View all events
                            </Link>
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="max-w-3xl mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {recentMembers.map((m) => (
                                    <Link
                                        key={m.id}
                                        href={m.user?.uuid ? route('profile.show', m.user.uuid) : '#'}
                                    >
                                        <Card padding="md" className="text-center hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
                                            <Avatar
                                                src={m.user?.avatar}
                                                name={m.user?.display_name}
                                                size="xl"
                                                rounded="lg"
                                                className="mx-auto"
                                            />
                                            <p className="font-semibold text-sm text-secondary-900 dark:text-white mt-3 truncate">
                                                {m.user?.display_name}
                                            </p>
                                            <Badge
                                                variant={CLUB_ROLE_COLORS[m.role]}
                                                size="sm"
                                                className="mt-1"
                                            >
                                                {CLUB_ROLE_LABELS[m.role]}
                                            </Badge>
                                            {(m.points ?? 0) > 0 && (
                                                <span className="text-xs text-accent-500 font-semibold mt-1">
                                                    {m.points} pts
                                                </span>
                                            )}
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <Link
                                    href={route('clubs.members', club.slug)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-xl font-semibold text-sm transition-colors hover:bg-secondary-200 dark:hover:bg-secondary-600"
                                >
                                    <UserGroupIcon className="h-5 w-5" />
                                    View All Members ({club.members_count ?? 0})
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Photos Tab */}
                    {activeTab === 'photos' && (
                        <div className="max-w-4xl mx-auto">
                            {isLeadership && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => photoInputRef.current?.click()}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm transition-colors"
                                    >
                                        <CameraIcon className="h-5 w-5" />
                                        Upload Photos
                                    </button>
                                    <input
                                        ref={photoInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                    />
                                </div>
                            )}
                            {photos.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {photos.map((photo) => (
                                        <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setLightboxPhoto(photo.path)}
                                                className="w-full h-full"
                                            >
                                                <img
                                                    src={photo.path}
                                                    alt={photo.caption || ''}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </button>
                                            {isLeadership && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this photo?')) {
                                                            router.delete(route('clubs.photos.destroy', [club.slug, photo.id]));
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card padding="lg">
                                    <div className="text-center py-12">
                                        <PhotoIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" />
                                        <h3 className="font-semibold text-secondary-900 dark:text-white">No photos yet</h3>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                            {isLeadership ? 'Upload photos to showcase your club.' : 'No photos have been shared yet.'}
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <Card padding="lg">
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                                    About {club.name}
                                </h3>
                                {club.description ? (
                                    <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed whitespace-pre-wrap">
                                        {club.description}
                                    </p>
                                ) : (
                                    <p className="text-secondary-400 italic">No description available.</p>
                                )}
                            </Card>

                            <Card padding="lg">
                                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                                    Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                                            <clubType.icon className="h-5 w-5 text-secondary-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-secondary-900 dark:text-white text-sm">{clubType.label}</p>
                                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{clubType.desc}</p>
                                        </div>
                                    </div>
                                    {club.city && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                                                <MapPinIcon className="h-5 w-5 text-secondary-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-secondary-900 dark:text-white text-sm">Location</p>
                                                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                                    {club.city}{club.province ? `, ${club.province}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                                            <ClockIcon className="h-5 w-5 text-secondary-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-secondary-900 dark:text-white text-sm">Created</p>
                                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                                {new Date(club.created_at).toLocaleDateString('en', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {club.owner && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                                                <UserGroupIcon className="h-5 w-5 text-secondary-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-secondary-900 dark:text-white text-sm">Founded by</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Avatar
                                                        src={club.owner.avatar}
                                                        name={club.owner.display_name}
                                                        size="xs"
                                                    />
                                                    <span className="text-sm text-secondary-600 dark:text-secondary-400">{club.owner.display_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {club.is_premium && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                                                <SparklesIcon className="h-5 w-5 text-accent-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-secondary-900 dark:text-white text-sm">Pro Club</p>
                                                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                                    This club has premium features enabled
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Chat CTA */}
                            {club.is_premium && isMember && (
                                <Card padding="lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                            <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-secondary-900 dark:text-white text-sm">Club Chat</h3>
                                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                                Chat with other members in real-time
                                            </p>
                                        </div>
                                        <Link
                                            href={route('clubs.chat', club.slug)}
                                            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors"
                                        >
                                            Open Chat
                                        </Link>
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Photo Lightbox ── */}
            {lightboxPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxPhoto(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
                        onClick={() => setLightboxPhoto(null)}
                    >
                        <XMarkIcon className="h-8 w-8" />
                    </button>
                    <img
                        src={lightboxPhoto}
                        alt=""
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </Layout>
    );
}

function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
