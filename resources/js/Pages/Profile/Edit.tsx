import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, Avatar, Badge, ListItem } from '@/Components/UI';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import clsx from 'clsx';
import {
    UserIcon,
    LockClosedIcon,
    BellIcon,
    ShieldCheckIcon,
    DevicePhoneMobileIcon,
    TrashIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    return (
        <AuthenticatedLayout header="Profile">
            <Head title="Profile" />

            <div className="space-y-6">
                <Card variant="elevated" padding="lg">
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={user?.avatar}
                            name={user?.name}
                            size="xl"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                                {user?.name}
                            </h2>
                            <p className="text-secondary-500 dark:text-secondary-400">
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
                    </div>
                </Card>

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
