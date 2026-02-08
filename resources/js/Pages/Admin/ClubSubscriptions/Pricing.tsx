import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/UI';
import { ClubSubscriptionSetting } from '@/types/club';

interface Props {
    settings: ClubSubscriptionSetting;
}

export default function ClubSubscriptionPricing({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        yearly_price: settings.yearly_price || '999.00',
        currency: settings.currency || 'PHP',
        description: settings.description || '',
        is_active: settings.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.club-subscriptions.pricing.update'));
    };

    return (
        <AdminLayout header="Club Pro Pricing">
            <Head title="Admin - Club Pro Pricing" />

            <div className="mb-4">
                <Link
                    href={route('admin.club-subscriptions.index')}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                    &larr; Back to Subscriptions
                </Link>
            </div>

            <div className="max-w-xl">
                <Card>
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                        Yearly Pro Subscription Pricing
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Yearly Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">₱</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.yearly_price}
                                    onChange={(e) => setData('yearly_price', e.target.value)}
                                    className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm pl-8 pr-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            {errors.yearly_price && (
                                <p className="text-sm text-danger-600 mt-1">{errors.yearly_price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Currency
                            </label>
                            <input
                                type="text"
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                                className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            {errors.currency && (
                                <p className="text-sm text-danger-600 mt-1">{errors.currency}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Description (optional)
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Description shown to club admins..."
                            />
                            {errors.description && (
                                <p className="text-sm text-danger-600 mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="is_active" className="text-sm text-secondary-700 dark:text-secondary-300">
                                Active (allow new subscriptions)
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Pricing'}
                        </button>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}
