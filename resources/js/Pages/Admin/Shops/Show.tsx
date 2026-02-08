import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, Avatar } from '@/Components/UI';
import { AdminShop } from '@/types/admin';

interface Props {
    shop: AdminShop;
    listingsCount: number;
}

const verificationVariants: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'secondary'> = {
    pending: 'warning',
    verified: 'success',
    rejected: 'danger',
};

export default function ShopShow({ shop, listingsCount }: Props) {
    const handleVerify = () => {
        router.post(route('admin.shops.verify', shop.id));
    };

    const handleReject = () => {
        if (confirm('Are you sure you want to reject this shop?')) {
            router.post(route('admin.shops.reject', shop.id));
        }
    };

    const handleToggleActive = () => {
        router.post(route('admin.shops.toggleActive', shop.id));
    };

    return (
        <AdminLayout header={`Shop: ${shop.name}`}>
            <Head title={`Admin - ${shop.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">{shop.name}</h2>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                    {[shop.city, shop.province].filter(Boolean).join(', ')}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={verificationVariants[shop.verification_status] || 'secondary'}>
                                    {shop.verification_status}
                                </Badge>
                                <Badge variant={shop.is_active ? 'success' : 'danger'}>
                                    {shop.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>
                        {shop.description && (
                            <p className="mt-4 text-secondary-700 dark:text-secondary-300">{shop.description}</p>
                        )}
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Statistics</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{listingsCount}</p>
                                <p className="text-xs text-secondary-500">Listings</p>
                            </div>
                            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{shop.average_rating}</p>
                                <p className="text-xs text-secondary-500">Avg Rating</p>
                            </div>
                            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{shop.total_reviews}</p>
                                <p className="text-xs text-secondary-500">Reviews</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Owner</h3>
                        <div className="flex items-center gap-3">
                            <Avatar name={shop.owner_name || 'Unknown'} size="md" />
                            <div>
                                <p className="font-medium text-secondary-900 dark:text-white">{shop.owner_name || 'Unknown'}</p>
                                <p className="text-xs text-secondary-500">{shop.owner_email}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Admin Actions</h3>
                        <div className="space-y-2">
                            {shop.verification_status === 'pending' && (
                                <>
                                    <button
                                        onClick={handleVerify}
                                        className="w-full px-4 py-2 text-sm font-medium text-success-600 bg-success-50 rounded-lg hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400 transition-colors"
                                    >
                                        Verify Shop
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="w-full px-4 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400 transition-colors"
                                    >
                                        Reject Verification
                                    </button>
                                </>
                            )}
                            <button
                                onClick={handleToggleActive}
                                className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    shop.is_active
                                        ? 'text-danger-600 bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400'
                                        : 'text-success-600 bg-success-50 hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400'
                                }`}
                            >
                                {shop.is_active ? 'Deactivate Shop' : 'Activate Shop'}
                            </button>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Details</h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-secondary-500">Created</dt>
                                <dd className="text-secondary-900 dark:text-white">{new Date(shop.created_at).toLocaleDateString()}</dd>
                            </div>
                        </dl>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
