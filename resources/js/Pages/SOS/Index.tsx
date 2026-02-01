import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, ListItem, Badge, Alert } from '@/Components/UI';
import clsx from 'clsx';
import {
    ShieldExclamationIcon,
    PhoneIcon,
    UserGroupIcon,
    HeartIcon,
    Cog6ToothIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import DangerButton from '@/Components/DangerButton';

interface EmergencyContact {
    id: number;
    name: string;
    phone: string;
    relationship: string;
}

interface SOSIndexProps {
    emergencyContacts?: EmergencyContact[];
    hasMedicalInfo?: boolean;
    hasActiveEmergency?: boolean;
}

export default function SOSIndex({
    emergencyContacts = [],
    hasMedicalInfo = false,
    hasActiveEmergency = false,
}: SOSIndexProps) {
    return (
        <AuthenticatedLayout header="Emergency SOS">
            <Head title="Emergency SOS" />

            <div className="space-y-6">
                {hasActiveEmergency && (
                    <Alert variant="error" title="Active Emergency">
                        You have an active emergency. Your contacts have been notified.
                    </Alert>
                )}

                <Card
                    variant="elevated"
                    padding="lg"
                    className={clsx(
                        'text-center',
                        'bg-gradient-to-br from-danger-500 to-danger-600',
                        'dark:from-danger-600 dark:to-danger-700',
                        'border-0'
                    )}
                >
                    <div className="py-6">
                        <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                            <ShieldExclamationIcon className="h-12 w-12 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            Emergency SOS
                        </h2>
                        <p className="text-white/80 text-sm mb-6 max-w-xs mx-auto">
                            Press the button below to alert your emergency contacts and share your location
                        </p>
                        <Link href={route('sos.trigger')}>
                            <DangerButton className="px-8 py-4 text-lg bg-white text-danger-600 hover:bg-white/90">
                                TRIGGER SOS
                            </DangerButton>
                        </Link>
                    </div>
                </Card>

                <ListItem.Group title="Quick Actions">
                    <ListItem
                        leading={
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <PhoneIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                        }
                        title="Emergency Contacts"
                        subtitle={`${emergencyContacts.length} contacts saved`}
                        href={route('sos.contacts')}
                        showArrow
                    />
                    <ListItem
                        leading={
                            <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                                <HeartIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
                            </div>
                        }
                        title="Medical Information"
                        subtitle={hasMedicalInfo ? 'Information saved' : 'Not set up'}
                        trailing={
                            !hasMedicalInfo && (
                                <Badge variant="warning" size="sm">
                                    Set up
                                </Badge>
                            )
                        }
                        href={route('sos.medical')}
                        showArrow
                    />
                    <ListItem
                        leading={
                            <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                                <Cog6ToothIcon className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                            </div>
                        }
                        title="SOS Settings"
                        subtitle="Configure alerts and notifications"
                        href={route('sos.settings')}
                        showArrow
                    />
                </ListItem.Group>

                {emergencyContacts.length > 0 && (
                    <Card padding="none">
                        <div className="p-4 border-b border-secondary-100 dark:border-secondary-700">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-secondary-900 dark:text-white">
                                    Emergency Contacts
                                </h2>
                                <Link
                                    href={route('sos.contacts')}
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {emergencyContacts.slice(0, 3).map((contact) => (
                                <div key={contact.id} className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                                        <UserGroupIcon className="h-5 w-5 text-secondary-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-secondary-900 dark:text-white truncate">
                                            {contact.name}
                                        </p>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                            {contact.relationship} • {contact.phone}
                                        </p>
                                    </div>
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                                    >
                                        <PhoneIcon className="h-5 w-5" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                <Card className="bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <ShieldExclamationIcon className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                        </div>
                        <div>
                            <h4 className="font-medium text-accent-900 dark:text-accent-100">
                                Safety Tips
                            </h4>
                            <ul className="mt-2 text-sm text-accent-700 dark:text-accent-300 space-y-1">
                                <li>• Always wear proper riding gear</li>
                                <li>• Check your bike before long rides</li>
                                <li>• Share your route with someone</li>
                                <li>• Keep emergency contacts updated</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
