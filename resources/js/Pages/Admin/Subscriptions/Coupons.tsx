import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge, SearchBar } from '@/Components/UI';
import Pagination from '@/Components/Admin/Pagination';
import { PaginatedData } from '@/types/admin';
import { SubscriptionCoupon, CouponDiscountType } from '@/types';

interface Props {
    coupons: PaginatedData<SubscriptionCoupon>;
    filters: {
        search?: string;
    };
}

interface CouponFormData {
    code: string;
    description: string;
    discount_type: CouponDiscountType;
    discount_value: string;
    max_uses: string;
    min_amount: string;
    starts_at: string;
    expires_at: string;
    is_active: boolean;
}

const defaultForm: CouponFormData = {
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    max_uses: '',
    min_amount: '',
    starts_at: '',
    expires_at: '',
    is_active: true,
};

export default function SubscriptionCoupons({ coupons, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<SubscriptionCoupon | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<CouponFormData>(defaultForm);

    const handleSearch = (value: string) => {
        router.get(route('admin.subscriptions.coupons'), { search: value }, { preserveState: true });
    };

    const openCreate = () => {
        setEditingCoupon(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (coupon: SubscriptionCoupon) => {
        setEditingCoupon(coupon);
        setData({
            code: coupon.code,
            description: coupon.description || '',
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            max_uses: coupon.max_uses?.toString() || '',
            min_amount: coupon.min_amount || '',
            starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : '',
            expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
            is_active: coupon.is_active,
        });
        clearErrors();
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCoupon) {
            put(route('admin.subscriptions.coupons.update', editingCoupon.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('admin.subscriptions.coupons.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleToggle = (coupon: SubscriptionCoupon) => {
        router.post(route('admin.subscriptions.coupons.toggle', coupon.id));
    };

    const handleDelete = (coupon: SubscriptionCoupon) => {
        if (confirm(`Delete coupon "${coupon.code}"?`)) {
            router.delete(route('admin.subscriptions.coupons.destroy', coupon.id));
        }
    };

    return (
        <AdminLayout header="Subscription Coupons">
            <Head title="Admin - Subscription Coupons" />

            <div className="mb-4">
                <Link
                    href={route('admin.subscriptions.index')}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                    &larr; Back to Subscriptions
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleSearch}
                    onClear={() => handleSearch('')}
                    placeholder="Search coupons..."
                    className="flex-1"
                />
                <button
                    onClick={openCreate}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                    Create Coupon
                </button>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Code</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Discount</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Usage</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Valid</th>
                                <th className="text-left px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Active</th>
                                <th className="text-right px-4 py-3 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {coupons.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-secondary-500 dark:text-secondary-400">
                                        No coupons found.
                                    </td>
                                </tr>
                            )}
                            {coupons.data.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                    <td className="px-4 py-3">
                                        <span className="font-mono font-medium text-secondary-900 dark:text-white">{coupon.code}</span>
                                        {coupon.description && (
                                            <p className="text-xs text-secondary-400 mt-0.5">{coupon.description}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-900 dark:text-white">
                                        {coupon.discount_type === 'percentage'
                                            ? `${coupon.discount_value}%`
                                            : `₱${Number(coupon.discount_value).toLocaleString()}`}
                                    </td>
                                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                                        {coupon.times_used}{coupon.max_uses ? ` / ${coupon.max_uses}` : ' / ∞'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-secondary-600 dark:text-secondary-400">
                                        {coupon.starts_at || coupon.expires_at ? (
                                            <>
                                                {coupon.starts_at && <div>From: {new Date(coupon.starts_at).toLocaleDateString()}</div>}
                                                {coupon.expires_at && <div>To: {new Date(coupon.expires_at).toLocaleDateString()}</div>}
                                            </>
                                        ) : 'No date limits'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={coupon.is_active ? 'success' : 'secondary'} size="sm">
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(coupon)}
                                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleToggle(coupon)}
                                                className="text-accent-600 hover:text-accent-700 dark:text-accent-400 text-sm font-medium"
                                            >
                                                {coupon.is_active ? 'Disable' : 'Enable'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon)}
                                                className="text-danger-600 hover:text-danger-700 dark:text-danger-400 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    links={coupons.links}
                    from={coupons.from}
                    to={coupons.to}
                    total={coupons.total}
                />
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Code</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                                    placeholder="e.g. PROMO50"
                                />
                                {errors.code && <p className="text-sm text-danger-600 mt-1">{errors.code}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Discount Type</label>
                                    <select
                                        value={data.discount_type}
                                        onChange={(e) => setData('discount_type', e.target.value as CouponDiscountType)}
                                        className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Discount Value {data.discount_type === 'percentage' ? '(%)' : '(₱)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.discount_value}
                                        onChange={(e) => setData('discount_value', e.target.value)}
                                        className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    {errors.discount_value && <p className="text-sm text-danger-600 mt-1">{errors.discount_value}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Max Uses</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.max_uses}
                                        onChange={(e) => setData('max_uses', e.target.value)}
                                        className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Min Amount (₱)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.min_amount}
                                        onChange={(e) => setData('min_amount', e.target.value)}
                                        className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="No minimum"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Starts At</label>
                                    <input
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                        className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Expires At</label>
                                    <input
                                        type="datetime-local"
                                        value={data.expires_at}
                                        onChange={(e) => setData('expires_at', e.target.value)}
                                        className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    {errors.expires_at && <p className="text-sm text-danger-600 mt-1">{errors.expires_at}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="coupon_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="coupon_active" className="text-sm text-secondary-700 dark:text-secondary-300">
                                    Active
                                </label>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-secondary-600 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
