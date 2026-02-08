import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, Avatar, EmptyState } from '@/Components/UI';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Form/Select';
import { StaffMember } from '@/types/admin';

interface Props {
    staffUsers: StaffMember[];
    allRoles: string[];
}

export default function StaffManagement({ staffUsers, allRoles }: Props) {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [assignRole, setAssignRole] = useState('');

    const handleAssignRole = (userId: number, role: string) => {
        if (!role) return;
        router.post(route('admin.settings.assignRole', userId), { role }, {
            preserveScroll: true,
        });
        setAssignRole('');
    };

    const handleRevokeRole = (userId: number, role: string) => {
        if (confirm(`Revoke "${role}" from this user?`)) {
            router.post(route('admin.settings.revokeRole', userId), { role }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout header="Staff Management">
            <Head title="Admin - Staff" />

            <div className="flex gap-4 mb-6">
                <Link
                    href={route('admin.settings.index')}
                    className="px-4 py-2 text-sm font-medium text-secondary-600 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600 transition-colors"
                >
                    App Settings
                </Link>
                <Link
                    href={route('admin.settings.staff')}
                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg"
                >
                    Staff Management
                </Link>
                <Link
                    href={route('admin.settings.features')}
                    className="px-4 py-2 text-sm font-medium text-secondary-600 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600 transition-colors"
                >
                    Features
                </Link>
            </div>

            {staffUsers.length > 0 ? (
                <div className="space-y-4">
                    {staffUsers.map((staff) => (
                        <Card key={staff.id}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar name={staff.name} size="md" />
                                    <div>
                                        <p className="font-medium text-secondary-900 dark:text-white">{staff.display_name}</p>
                                        <p className="text-sm text-secondary-500">{staff.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {staff.roles.map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => handleRevokeRole(staff.id, role)}
                                                className="group relative"
                                                title={`Click to revoke "${role}"`}
                                            >
                                                <Badge variant="primary" size="sm">
                                                    {role}
                                                    <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                                                </Badge>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            options={[
                                                { value: '', label: 'Add role...' },
                                                ...allRoles
                                                    .filter((r) => !staff.roles.includes(r))
                                                    .map((r) => ({ value: r, label: r })),
                                            ]}
                                            value=""
                                            onChange={(e) => handleAssignRole(staff.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No staff members"
                    description="Users with admin, moderator, shop-admin, or trusted-rider roles will appear here."
                />
            )}

            <Card className="mt-8">
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">How to add staff</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    To add a new staff member, go to the{' '}
                    <Link href={route('admin.users.index')} className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        Users page
                    </Link>
                    , find the user, and assign them a role from their profile page. They will then appear here.
                </p>
            </Card>
        </AdminLayout>
    );
}
