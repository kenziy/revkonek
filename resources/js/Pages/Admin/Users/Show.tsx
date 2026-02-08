import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, Avatar, ProBadge } from '@/Components/UI';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Select from '@/Components/Form/Select';
import { AdminUser, AdminSubscription, AuditLog, SubscriptionPlan } from '@/types/admin';

interface Props {
    user: AdminUser;
    userRoles: string[];
    userPermissions: string[];
    allRoles: string[];
    recentActivity: AuditLog[];
    stats: {
        clubsCount: number;
        vehiclesCount: number;
        challengesSent: number;
        challengesReceived: number;
    };
    activeSubscription?: AdminSubscription;
    subscriptionPlans: SubscriptionPlan[];
}

export default function UserShow({ user, userRoles, userPermissions, allRoles, recentActivity, stats, activeSubscription, subscriptionPlans }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'activity'>('overview');
    const [showGrantForm, setShowGrantForm] = useState(false);
    const [grantPlanId, setGrantPlanId] = useState(subscriptionPlans[0]?.id?.toString() || '');
    const [grantDuration, setGrantDuration] = useState('1');

    const editForm = useForm({
        name: user.name,
        email: user.email,
        username: user.username || '',
    });

    const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles);

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('admin.users.update', user.id));
    };

    const handleSyncRoles = () => {
        router.post(route('admin.users.syncRoles', user.id), { roles: selectedRoles });
    };

    const handleBan = () => {
        if (confirm('Are you sure you want to ban this user?')) {
            router.post(route('admin.users.ban', user.id));
        }
    };

    const handleUnban = () => {
        router.post(route('admin.users.unban', user.id));
    };

    const handleVerify = () => {
        router.post(route('admin.users.verify', user.id));
    };

    const handleGrantPro = () => {
        router.post(route('admin.subscriptions.grantPro', user.id), {
            plan_id: parseInt(grantPlanId),
            duration_months: parseInt(grantDuration),
        }, {
            onSuccess: () => setShowGrantForm(false),
        });
    };

    const handleRevokePro = () => {
        if (confirm(`Are you sure you want to revoke Pro from ${user.name}?`)) {
            router.post(route('admin.subscriptions.revokePro', user.id));
        }
    };

    const toggleRole = (role: string) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const tabs = [
        { key: 'overview' as const, label: 'Overview' },
        { key: 'roles' as const, label: 'Roles & Permissions' },
        { key: 'activity' as const, label: 'Activity' },
    ];

    return (
        <AdminLayout header={`User: ${user.name}`}>
            <Head title={`Admin - ${user.name}`} />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="lg:w-80">
                    <Card>
                        <div className="flex flex-col items-center text-center">
                            <Avatar name={user.name} size="xl" />
                            <h2 className="mt-3 text-lg font-semibold text-secondary-900 dark:text-white">{user.name}</h2>
                            {user.username && (
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">@{user.username}</p>
                            )}
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">{user.email}</p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant={user.is_active ? 'success' : 'danger'}>
                                    {user.is_active ? 'Active' : 'Banned'}
                                </Badge>
                                {user.email_verified_at && (
                                    <Badge variant="info">Verified</Badge>
                                )}
                                {user.is_premium && <ProBadge size="md" />}
                            </div>

                            <div className="flex gap-2 mt-4 w-full">
                                {user.is_active ? (
                                    <button
                                        onClick={handleBan}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400 transition-colors"
                                    >
                                        Ban User
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleUnban}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-success-600 bg-success-50 rounded-lg hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400 transition-colors"
                                    >
                                        Unban User
                                    </button>
                                )}
                                {!user.email_verified_at && (
                                    <button
                                        onClick={handleVerify}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                                    >
                                        Verify Email
                                    </button>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="mt-4">
                        <h3 className="font-medium text-secondary-900 dark:text-white mb-3">Stats</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-lg font-bold text-secondary-900 dark:text-white">{stats.clubsCount}</p>
                                <p className="text-xs text-secondary-500">Clubs</p>
                            </div>
                            <div className="text-center p-2 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-lg font-bold text-secondary-900 dark:text-white">{stats.vehiclesCount}</p>
                                <p className="text-xs text-secondary-500">Vehicles</p>
                            </div>
                            <div className="text-center p-2 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-lg font-bold text-secondary-900 dark:text-white">{stats.challengesSent}</p>
                                <p className="text-xs text-secondary-500">Sent</p>
                            </div>
                            <div className="text-center p-2 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-lg font-bold text-secondary-900 dark:text-white">{stats.challengesReceived}</p>
                                <p className="text-xs text-secondary-500">Received</p>
                            </div>
                        </div>
                    </Card>

                    {/* Pro Subscription Management */}
                    <Card className="mt-4">
                        <h3 className="font-medium text-secondary-900 dark:text-white mb-3">Pro Subscription</h3>
                        {user.is_premium && activeSubscription ? (
                            <div className="space-y-2">
                                <div className="p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
                                    <p className="text-sm font-medium text-success-700 dark:text-success-400">Active Pro</p>
                                    <p className="text-xs text-success-600 dark:text-success-500 mt-0.5">
                                        {activeSubscription.plan_name || 'Pro Plan'}
                                    </p>
                                    {activeSubscription.ends_at && (
                                        <p className="text-xs text-secondary-500 mt-1">
                                            Expires: {new Date(activeSubscription.ends_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleRevokePro}
                                    className="w-full px-3 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400 transition-colors"
                                >
                                    Revoke Pro
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-secondary-500">User is on free tier.</p>
                                {!showGrantForm ? (
                                    <button
                                        onClick={() => setShowGrantForm(true)}
                                        className="w-full px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                                    >
                                        Grant Pro
                                    </button>
                                ) : (
                                    <div className="space-y-3 p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                        <div>
                                            <InputLabel htmlFor="grant_plan" value="Plan" />
                                            <Select
                                                id="grant_plan"
                                                options={subscriptionPlans.map((p) => ({
                                                    value: p.id,
                                                    label: `${p.name} (${p.currency} ${Number(p.price).toLocaleString()})`,
                                                }))}
                                                value={grantPlanId}
                                                onChange={(e) => setGrantPlanId(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="grant_duration" value="Duration (months)" />
                                            <Select
                                                id="grant_duration"
                                                options={[
                                                    { value: '1', label: '1 month' },
                                                    { value: '3', label: '3 months' },
                                                    { value: '6', label: '6 months' },
                                                    { value: '12', label: '1 year' },
                                                    { value: '24', label: '2 years' },
                                                ]}
                                                value={grantDuration}
                                                onChange={(e) => setGrantDuration(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleGrantPro}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setShowGrantForm(false)}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-secondary-700 bg-secondary-200 rounded-lg hover:bg-secondary-300 dark:bg-secondary-600 dark:text-secondary-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Main content */}
                <div className="flex-1">
                    <div className="flex gap-1 border-b border-secondary-200 dark:border-secondary-700 mb-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                    activeTab === tab.key
                                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <Card>
                            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Edit User</h3>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Name</label>
                                    <TextInput
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Email</label>
                                    <TextInput
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Username</label>
                                    <TextInput
                                        value={editForm.data.username}
                                        onChange={(e) => editForm.setData('username', e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </Card>
                    )}

                    {activeTab === 'roles' && (
                        <Card>
                            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Roles</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {allRoles.map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => toggleRole(role)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                            selectedRoles.includes(role)
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300'
                                        }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleSyncRoles}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                                Update Roles
                            </button>

                            <h3 className="font-semibold text-secondary-900 dark:text-white mt-6 mb-3">Current Permissions</h3>
                            <div className="flex flex-wrap gap-2">
                                {userPermissions.map((perm) => (
                                    <Badge key={perm} variant="secondary" size="sm">{perm}</Badge>
                                ))}
                                {userPermissions.length === 0 && (
                                    <p className="text-sm text-secondary-500">No permissions assigned.</p>
                                )}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'activity' && (
                        <Card padding="none">
                            <Card.Header>
                                <h3 className="font-semibold text-secondary-900 dark:text-white">Recent Activity</h3>
                            </Card.Header>
                            <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                                {recentActivity.map((log) => (
                                    <div key={log.id} className="px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                                {log.action}
                                            </p>
                                            <span className="text-xs text-secondary-500">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                        {log.ip_address && (
                                            <p className="text-xs text-secondary-500 mt-0.5">IP: {log.ip_address}</p>
                                        )}
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <p className="px-4 py-8 text-sm text-secondary-500 text-center">No activity recorded.</p>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
