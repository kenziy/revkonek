import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge } from '@/Components/UI';
import { UserSubscription, SubscriptionStatus } from '@/types';

interface Props {
    subscription: UserSubscription & {
        user?: {
            id: number;
            name: string;
            username?: string;
            email: string;
        };
    };
}

const statusVariants: Record<SubscriptionStatus, 'primary' | 'success' | 'danger' | 'warning' | 'secondary'> = {
    pending_verification: 'warning',
    active: 'success',
    expired: 'secondary',
    rejected: 'danger',
    cancelled: 'secondary',
    trialing: 'primary',
};

const statusLabels: Record<SubscriptionStatus, string> = {
    pending_verification: 'Pending Verification',
    active: 'Active',
    expired: 'Expired',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    trialing: 'Trialing',
};

export default function SubscriptionShow({ subscription }: Props) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleVerify = () => {
        if (action === 'reject' && !adminNote.trim()) return;

        setProcessing(true);
        router.post(
            route('admin.subscriptions.verify', subscription.id),
            {
                action,
                admin_note: adminNote || null,
            },
            {
                onFinish: () => setProcessing(false),
                onSuccess: () => setAction(null),
            },
        );
    };

    const isPending = subscription.status === 'pending_verification';
    const status = subscription.status as SubscriptionStatus;

    return (
        <AdminLayout header="Subscription Detail">
            <Head title="Admin - Subscription Detail" />

            <div className="mb-4">
                <Link
                    href={route('admin.subscriptions.index')}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                    &larr; Back to Subscriptions
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Receipt Image */}
                    {subscription.receipt_path && (
                        <Card>
                            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Payment Receipt</h3>
                            <div className="rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-700">
                                <img
                                    src={`/storage/${subscription.receipt_path}`}
                                    alt="Payment Receipt"
                                    className="w-full max-h-[600px] object-contain"
                                />
                            </div>
                        </Card>
                    )}

                    {/* Subscription Details */}
                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Subscription Details</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-secondary-500 dark:text-secondary-400">User</dt>
                                <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                    {subscription.user?.name || 'N/A'}
                                    {subscription.user?.email && (
                                        <span className="text-secondary-400 ml-1">({subscription.user.email})</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-secondary-500 dark:text-secondary-400">Plan</dt>
                                <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                    {subscription.plan?.name || 'N/A'}
                                </dd>
                            </div>
                            {subscription.amount && (
                                <div>
                                    <dt className="text-secondary-500 dark:text-secondary-400">Amount</dt>
                                    <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                        ₱{Number(subscription.amount).toLocaleString()}
                                        {subscription.coupon && subscription.original_amount && (
                                            <span className="text-secondary-400 ml-1">
                                                (original: ₱{Number(subscription.original_amount).toLocaleString()})
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-secondary-500 dark:text-secondary-400">Coupon</dt>
                                <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                    {subscription.coupon ? (
                                        <Badge variant="info" size="sm">{subscription.coupon.code}</Badge>
                                    ) : '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-secondary-500 dark:text-secondary-400">Status</dt>
                                <dd className="mt-1">
                                    <Badge variant={statusVariants[status] || 'secondary'} size="sm">
                                        {statusLabels[status] || subscription.status}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-secondary-500 dark:text-secondary-400">Submitted</dt>
                                <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                    {new Date(subscription.created_at).toLocaleString()}
                                </dd>
                            </div>
                            {subscription.starts_at && (
                                <div>
                                    <dt className="text-secondary-500 dark:text-secondary-400">Starts At</dt>
                                    <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                        {new Date(subscription.starts_at).toLocaleString()}
                                    </dd>
                                </div>
                            )}
                            {subscription.ends_at && (
                                <div>
                                    <dt className="text-secondary-500 dark:text-secondary-400">Ends At</dt>
                                    <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                        {new Date(subscription.ends_at).toLocaleString()}
                                    </dd>
                                </div>
                            )}
                            {subscription.verifier && (
                                <div>
                                    <dt className="text-secondary-500 dark:text-secondary-400">Verified By</dt>
                                    <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                        {subscription.verifier.name}
                                        {subscription.verified_at && (
                                            <span className="text-secondary-400 ml-1">
                                                on {new Date(subscription.verified_at).toLocaleString()}
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            )}
                            {subscription.admin_note && (
                                <div className="col-span-2">
                                    <dt className="text-secondary-500 dark:text-secondary-400">Admin Note</dt>
                                    <dd className="font-medium text-secondary-900 dark:text-white mt-1">
                                        {subscription.admin_note}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Admin Actions */}
                    {isPending && (
                        <Card>
                            <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Admin Actions</h3>

                            {!action ? (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setAction('approve')}
                                        className="w-full px-4 py-2 text-sm font-medium text-success-600 bg-success-50 rounded-lg hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400 transition-colors"
                                    >
                                        Approve Subscription
                                    </button>
                                    <button
                                        onClick={() => setAction('reject')}
                                        className="w-full px-4 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400 transition-colors"
                                    >
                                        Reject Subscription
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={action === 'approve' ? 'success' : 'danger'}>
                                            {action === 'approve' ? 'Approving' : 'Rejecting'}
                                        </Badge>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                            Note {action === 'reject' && <span className="text-danger-500">*</span>}
                                        </label>
                                        <textarea
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                            rows={3}
                                            className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder={action === 'reject' ? 'Reason for rejection (required)' : 'Optional note'}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleVerify}
                                            disabled={processing || (action === 'reject' && !adminNote.trim())}
                                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                                                action === 'approve'
                                                    ? 'text-white bg-success-600 hover:bg-success-700'
                                                    : 'text-white bg-danger-600 hover:bg-danger-700'
                                            }`}
                                        >
                                            {processing ? 'Processing...' : action === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
                                        </button>
                                        <button
                                            onClick={() => { setAction(null); setAdminNote(''); }}
                                            className="px-4 py-2 text-sm font-medium text-secondary-600 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* User Info */}
                    {subscription.user && (
                        <Card>
                            <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">User Info</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-secondary-500">Name</dt>
                                    <dd className="text-secondary-900 dark:text-white font-medium">{subscription.user.name}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-secondary-500">Email</dt>
                                    <dd className="text-secondary-900 dark:text-white">{subscription.user.email}</dd>
                                </div>
                                {subscription.user.username && (
                                    <div className="flex justify-between">
                                        <dt className="text-secondary-500">Username</dt>
                                        <dd className="text-secondary-900 dark:text-white">@{subscription.user.username}</dd>
                                    </div>
                                )}
                            </dl>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
