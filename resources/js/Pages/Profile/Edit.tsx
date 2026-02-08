import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, UserSubscription } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Card, Badge, ListItem, ProBadge } from '@/Components/UI';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useRef } from 'react';
import clsx from 'clsx';
import {
    UserIcon,
    LockClosedIcon,
    BellIcon,
    ShieldCheckIcon,
    DevicePhoneMobileIcon,
    TrashIcon,
    CameraIcon,
    UserCircleIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon, CreditCardIcon } from '@heroicons/react/24/solid';

export default function Edit({
    mustVerifyEmail,
    status,
    activeSubscription,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    activeSubscription: UserSubscription | null;
}>) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isPremium = auth?.is_premium;

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

    return (
        <AuthenticatedLayout header="Profile">
            <Head title="Profile" />

            <div className="space-y-6">
                {/* Cover Photo + Avatar Hero */}
                <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6">
                    <div className="relative group">
                        <div className="h-40 sm:h-52 w-full overflow-visible bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                            <div className="h-full w-full overflow-hidden">
                                {user?.cover_photo ? (
                                    <img
                                        src={user.cover_photo}
                                        alt="Cover photo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <UserCircleIcon className="h-12 w-12 text-white/20 mx-auto" />
                                            <p className="text-white/40 text-sm mt-2">Add a cover photo</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Cover photo edit button */}
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className={clsx(
                                'absolute inset-0 bottom-0 flex items-center justify-center',
                                'opacity-0 group-hover:opacity-100 transition-all',
                            )}
                        >
                            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-white text-sm font-medium backdrop-blur-sm">
                                <CameraIcon className="h-4 w-4" />
                                {user?.cover_photo ? 'Edit Cover' : 'Add Cover Photo'}
                            </span>
                        </button>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverUpload}
                        />

                        {/* Avatar */}
                        <div className="absolute -bottom-6 sm:-bottom-8 left-4 sm:left-6 z-20 group/avatar">
                            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-secondary-800 shadow-lg overflow-hidden bg-white dark:bg-secondary-700">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user?.display_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                        <span className="text-3xl sm:text-4xl font-bold text-white">
                                            {user?.display_name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
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
                        </div>
                    </div>

                    {/* Profile info bar below cover */}
                    <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 pt-10 sm:pt-12 pb-4 px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">
                                        {user?.display_name}
                                    </h2>
                                    {isPremium && <ProBadge size="md" />}
                                </div>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                                    {user?.email}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="primary" size="sm">
                                        Rider
                                    </Badge>
                                    {user?.email_verified_at && (
                                        <Badge variant="success" size="sm">
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {user?.uuid && (
                                <Link
                                    href={route('profile.show', user.uuid)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors shadow-sm"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                    View Public Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upgrade / Subscription Status Card */}
                {isPremium && activeSubscription ? (
                    <Link href={route('subscription.index')}>
                        <Card variant="elevated" padding="lg">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30">
                                    <SparklesIcon className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                                            {activeSubscription.plan?.name ?? 'Pro'} Plan
                                        </h3>
                                        <Badge variant="success" size="sm">Active</Badge>
                                    </div>
                                    {activeSubscription.ends_at && (
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                                            Expires {new Date(activeSubscription.ends_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </Card>
                    </Link>
                ) : (
                    <Link href={route('subscription.index')}>
                        <div className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                                    <SparklesIcon className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white">
                                        Upgrade to Pro
                                    </h3>
                                    <p className="text-sm text-white/80 mt-0.5">
                                        Unlimited bikes, photo gallery, layout templates, mods list & more
                                    </p>
                                </div>
                                <svg className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                )}

                <Card padding="none">
                    <div className="p-4 border-b border-secondary-100 dark:border-secondary-700">
                        <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Profile Information
                        </h3>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                            Update your account's profile information and email address.
                        </p>
                    </div>
                    <div className="p-4">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                </Card>

                <Card padding="none">
                    <div className="p-4 border-b border-secondary-100 dark:border-secondary-700">
                        <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                            <LockClosedIcon className="h-5 w-5" />
                            Update Password
                        </h3>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                            Ensure your account is using a long, random password to stay secure.
                        </p>
                    </div>
                    <div className="p-4">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </Card>

                <ListItem.Group title="Settings">
                    <ListItem
                        leading={
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <CreditCardIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        }
                        title="Subscription"
                        subtitle="Manage your plan and billing"
                        href={route('subscription.index')}
                        showArrow
                    />
                    <ListItem
                        leading={
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <BellIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                        }
                        title="Notifications"
                        subtitle="Manage your notification preferences"
                        href={route('notifications.settings')}
                        showArrow
                    />
                    <ListItem
                        leading={
                            <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                                <ShieldCheckIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
                            </div>
                        }
                        title="Privacy"
                        subtitle="Control who can see your profile"
                        href={route('profile.privacy')}
                        showArrow
                    />
                    <ListItem
                        leading={
                            <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                                <DevicePhoneMobileIcon className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                            </div>
                        }
                        title="Sessions"
                        subtitle="Manage your active sessions"
                        href={route('profile.sessions')}
                        showArrow
                    />
                </ListItem.Group>

                <Card
                    padding="none"
                    className="border-danger-200 dark:border-danger-800"
                >
                    <div className="p-4 border-b border-danger-100 dark:border-danger-900">
                        <h3 className="font-semibold text-danger-600 dark:text-danger-400 flex items-center gap-2">
                            <TrashIcon className="h-5 w-5" />
                            Delete Account
                        </h3>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                            Once deleted, all of your data will be permanently removed.
                        </p>
                    </div>
                    <div className="p-4">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
