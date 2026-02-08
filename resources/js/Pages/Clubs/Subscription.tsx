import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Card, Badge } from '@/Components/UI';
import ProgressBar from '@/Components/UI/ProgressBar';
import FileUpload from '@/Components/Form/FileUpload';
import { Club, ClubSubscriptionSetting } from '@/types/club';
import type { ClubSubscription } from '@/types/club';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

interface Props {
    club: Club;
    settings: ClubSubscriptionSetting | null;
    activeSubscription: ClubSubscription | null;
    latestSubscription: ClubSubscription | null;
}

const features = [
    { feature: 'Max Members', free: '50', pro: 'Unlimited' },
    { feature: 'Rides / Month', free: '5', pro: 'Unlimited' },
    { feature: 'Pinned Posts', free: '1', pro: 'Unlimited' },
    { feature: 'Club Chat', free: false, pro: true },
    { feature: 'Cover Image', free: false, pro: true },
    { feature: 'Custom Theme', free: false, pro: true },
    { feature: 'Analytics', free: false, pro: true },
    { feature: 'Verified Badge', free: false, pro: true },
    { feature: 'Members-Only Posts', free: false, pro: true },
    { feature: 'Event Management', free: false, pro: true },
];

export default function Subscription({ club, settings, activeSubscription, latestSubscription }: Props) {
    const pageErrors = usePage().props.errors as Record<string, string>;
    const [couponCode, setCouponCode] = useState('');
    const [couponValidating, setCouponValidating] = useState(false);
    const [couponResult, setCouponResult] = useState<{
        valid: boolean;
        discount?: number;
        final_amount?: number;
        error?: string;
    } | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        receipt: File | null;
        coupon_code: string;
    }>({
        receipt: null,
        coupon_code: '',
    });

    const validateCoupon = async () => {
        if (!couponCode.trim()) return;

        setCouponValidating(true);
        try {
            const response = await fetch(route('clubs.subscription.validateCoupon', club.slug), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ coupon_code: couponCode }),
            });
            const result = await response.json();
            setCouponResult(result);

            if (result.valid) {
                setData('coupon_code', couponCode);
            }
        } catch {
            setCouponResult({ valid: false, error: 'Failed to validate coupon.' });
        } finally {
            setCouponValidating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clubs.subscription.store', club.slug), {
            forceFormData: true,
        });
    };

    const displayPrice = settings ? Number(settings.yearly_price) : 0;
    const finalPrice = couponResult?.valid && couponResult.final_amount != null
        ? couponResult.final_amount
        : displayPrice;

    // Active subscription view
    if (activeSubscription && activeSubscription.status === 'active') {
        const start = new Date(activeSubscription.starts_at!);
        const end = new Date(activeSubscription.ends_at!);
        const now = new Date();
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

        return (
            <AuthenticatedLayout header={`${club.name} — Subscription`}>
                <Head title={`${club.name} Subscription`} />

                <div className="max-w-2xl mx-auto space-y-6">
                    <Link
                        href={route('clubs.settings', club.slug)}
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Settings
                    </Link>

                    <Card padding="lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30">
                                <CheckCircleIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-secondary-900 dark:text-white">Pro Active</h2>
                                <p className="text-sm text-secondary-500">Your club is on the Pro plan</p>
                            </div>
                            <Badge variant="success" size="lg" className="ml-auto">Active</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Started</p>
                                <p className="font-medium text-secondary-900 dark:text-white">{start.toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Expires</p>
                                <p className="font-medium text-secondary-900 dark:text-white">{end.toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Amount Paid</p>
                                <p className="font-medium text-secondary-900 dark:text-white">₱{Number(activeSubscription.amount).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Days Remaining</p>
                                <p className="font-medium text-secondary-900 dark:text-white">{daysRemaining} days</p>
                            </div>
                        </div>

                        <ProgressBar
                            value={totalDays - daysRemaining}
                            max={totalDays}
                            variant={daysRemaining < 30 ? 'warning' : 'success'}
                            showLabel
                            label="Subscription Progress"
                        />
                    </Card>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Pending verification view
    if (latestSubscription && latestSubscription.status === 'pending_verification') {
        return (
            <AuthenticatedLayout header={`${club.name} — Subscription`}>
                <Head title={`${club.name} Subscription`} />

                <div className="max-w-2xl mx-auto space-y-6">
                    <Link
                        href={route('clubs.settings', club.slug)}
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Settings
                    </Link>

                    <Card padding="lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30">
                                <ClockIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-secondary-900 dark:text-white">Under Review</h2>
                                <p className="text-sm text-secondary-500">Your payment receipt is being verified</p>
                            </div>
                            <Badge variant="warning" size="lg" className="ml-auto">Pending</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Amount</p>
                                <p className="font-medium text-secondary-900 dark:text-white">₱{Number(latestSubscription.amount).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Submitted</p>
                                <p className="font-medium text-secondary-900 dark:text-white">{new Date(latestSubscription.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-700">
                            <img
                                src={`/storage/${latestSubscription.receipt_path}`}
                                alt="Payment Receipt"
                                className="w-full max-h-[300px] object-contain"
                            />
                        </div>
                    </Card>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Rejected view — can re-submit
    const isRejected = latestSubscription && latestSubscription.status === 'rejected';

    // Free / Upgrade view
    return (
        <AuthenticatedLayout header={`${club.name} — Subscription`}>
            <Head title={`${club.name} Subscription`} />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="mb-4">
                    <Link
                        href={route('clubs.settings', club.slug)}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        &larr; Back to Settings
                    </Link>
                </div>

                {/* Rejection notice */}
                {isRejected && (
                    <Card padding="lg" className="border-danger-200 dark:border-danger-800">
                        <div className="flex items-start gap-3">
                            <XCircleIcon className="h-6 w-6 text-danger-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-danger-600 dark:text-danger-400">Previous Request Rejected</h3>
                                {latestSubscription!.admin_note && (
                                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                                        Reason: {latestSubscription!.admin_note}
                                    </p>
                                )}
                                <p className="text-sm text-secondary-500 mt-2">
                                    You can submit a new request below.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {!settings ? (
                    <Card padding="lg">
                        <div className="text-center py-8">
                            <ExclamationTriangleIcon className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
                            <p className="text-secondary-600 dark:text-secondary-400">
                                Subscriptions are currently not available. Please check back later.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Pricing Card */}
                        <Card padding="lg">
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <SparklesIcon className="h-6 w-6 text-accent-500" />
                                    <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Upgrade to Pro</h2>
                                </div>
                                <div className="flex items-baseline justify-center gap-1 mt-3">
                                    {couponResult?.valid && couponResult.discount ? (
                                        <>
                                            <span className="text-lg text-secondary-400 line-through">₱{displayPrice.toLocaleString()}</span>
                                            <span className="text-3xl font-bold text-accent-600">₱{finalPrice.toLocaleString()}</span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-accent-600">₱{displayPrice.toLocaleString()}</span>
                                    )}
                                    <span className="text-secondary-500">/ year</span>
                                </div>
                                {settings.description && (
                                    <p className="text-sm text-secondary-500 mt-2">{settings.description}</p>
                                )}
                            </div>

                            {/* Feature Comparison */}
                            <div className="border rounded-lg overflow-hidden divide-y divide-secondary-100 dark:divide-secondary-700 border-secondary-200 dark:border-secondary-700 mb-6">
                                <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-secondary-50 dark:bg-secondary-800/50 text-xs font-medium text-secondary-500 uppercase">
                                    <span>Feature</span>
                                    <span className="text-center">Free</span>
                                    <span className="text-center">Pro</span>
                                </div>
                                {features.map(({ feature, free, pro }) => (
                                    <div key={feature} className="grid grid-cols-3 gap-4 px-4 py-2.5 text-sm">
                                        <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
                                        <span className="text-center text-secondary-500">
                                            {typeof free === 'boolean' ? (free ? '✓' : '—') : free}
                                        </span>
                                        <span className="text-center text-accent-600 font-medium">
                                            {typeof pro === 'boolean' ? (pro ? '✓' : '—') : pro}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Payment Form */}
                        <Card padding="lg">
                            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                                Submit Payment
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Coupon */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Coupon Code (optional)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponResult(null);
                                            }}
                                            className="flex-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                                            placeholder="Enter coupon code"
                                        />
                                        <button
                                            type="button"
                                            onClick={validateCoupon}
                                            disabled={couponValidating || !couponCode.trim()}
                                            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors disabled:opacity-50"
                                        >
                                            {couponValidating ? 'Checking...' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponResult && (
                                        <p className={`text-sm mt-1 ${couponResult.valid ? 'text-success-600' : 'text-danger-600'}`}>
                                            {couponResult.valid
                                                ? `Discount applied! You save ₱${couponResult.discount?.toLocaleString()}`
                                                : couponResult.error}
                                        </p>
                                    )}
                                </div>

                                {/* Receipt Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Payment Receipt <span className="text-danger-500">*</span>
                                    </label>
                                    <p className="text-xs text-secondary-500 mb-2">
                                        Upload a screenshot or photo of your payment receipt (max 5MB).
                                    </p>
                                    <FileUpload
                                        accept="image/*"
                                        maxSize={5 * 1024 * 1024}
                                        onChange={(files) => setData('receipt', files[0] || null)}
                                        error={errors.receipt}
                                    />
                                </div>

                                {/* Summary */}
                                <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-secondary-600 dark:text-secondary-400">Yearly Pro Plan</span>
                                        <span className="text-secondary-900 dark:text-white">₱{displayPrice.toLocaleString()}</span>
                                    </div>
                                    {couponResult?.valid && couponResult.discount ? (
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-success-600">Coupon Discount</span>
                                            <span className="text-success-600">-₱{couponResult.discount.toLocaleString()}</span>
                                        </div>
                                    ) : null}
                                    <div className="flex justify-between text-sm font-bold border-t border-secondary-200 dark:border-secondary-700 pt-2 mt-2">
                                        <span className="text-secondary-900 dark:text-white">Total</span>
                                        <span className="text-accent-600">₱{finalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                {pageErrors?.subscription && (
                                    <p className="text-sm text-danger-600">{pageErrors.subscription}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing || !data.receipt}
                                    className="w-full px-4 py-3 text-sm font-semibold text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <SparklesIcon className="h-5 w-5" />
                                    {processing ? 'Submitting...' : 'Submit Payment & Upgrade'}
                                </button>
                            </form>
                        </Card>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
