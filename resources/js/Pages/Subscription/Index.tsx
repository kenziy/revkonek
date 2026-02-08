import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, SubscriptionPlan, UserSubscription } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Card, Badge } from '@/Components/UI';
import ProgressBar from '@/Components/UI/ProgressBar';
import ProBadge from '@/Components/UI/ProBadge';
import FileUpload from '@/Components/Form/FileUpload';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    SparklesIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
    plans: SubscriptionPlan[];
    activeSubscription: UserSubscription | null;
    latestSubscription: UserSubscription | null;
}

const features = [
    { feature: 'Vehicle Photos', free: '1', pro: 'Up to 10' },
    { feature: 'Bikes', free: '2', pro: 'Unlimited' },
    { feature: 'Club Memberships', free: '3', pro: 'Unlimited' },
    { feature: 'Daily Discoveries', free: '10', pro: 'Unlimited' },
    { feature: 'Daily Messages', free: '20', pro: 'Unlimited' },
    { feature: 'Photo Gallery', free: false, pro: true },
    { feature: 'Layout Templates', free: false, pro: true },
    { feature: 'Color Themes', free: false, pro: true },
    { feature: 'Mods List', free: false, pro: true },
    { feature: 'Vehicle Story', free: false, pro: true },
    { feature: 'Cover Banner', free: false, pro: true },
    { feature: 'Social Links', free: false, pro: true },
    { feature: 'Background Music', free: false, pro: true },
    { feature: 'Pro Badge', free: false, pro: true },
];

export default function Index({ plans, activeSubscription, latestSubscription }: Props) {
    const { auth } = usePage().props as PageProps;
    const pageErrors = usePage().props.errors as Record<string, string>;
    const isPremium = auth?.is_premium;

    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(plans.length > 0 ? plans[0] : null);
    const [couponCode, setCouponCode] = useState('');
    const [couponValidating, setCouponValidating] = useState(false);
    const [couponResult, setCouponResult] = useState<{
        valid: boolean;
        discount?: number;
        final_amount?: number;
        error?: string;
    } | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        plan_id: number | '';
        receipt: File | null;
        coupon_code: string;
    }>({
        plan_id: plans.length > 0 ? plans[0].id : '',
        receipt: null,
        coupon_code: '',
    });

    const validateCoupon = async () => {
        if (!couponCode.trim() || !selectedPlan) return;

        setCouponValidating(true);
        try {
            const response = await fetch(route('subscription.validateCoupon'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ coupon_code: couponCode, plan_id: selectedPlan.id }),
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
        post(route('subscription.store'), {
            forceFormData: true,
        });
    };

    const handlePlanSelect = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setData('plan_id', plan.id);
        // Reset coupon when plan changes
        setCouponResult(null);
        setCouponCode('');
        setData('coupon_code', '');
    };

    const displayPrice = selectedPlan ? Number(selectedPlan.price) : 0;
    const finalPrice = couponResult?.valid && couponResult.final_amount != null
        ? couponResult.final_amount
        : displayPrice;

    // Active subscription view
    if (isPremium && activeSubscription && ['active', 'trialing'].includes(activeSubscription.status)) {
        const start = activeSubscription.starts_at ? new Date(activeSubscription.starts_at) : new Date(activeSubscription.created_at);
        const end = activeSubscription.ends_at ? new Date(activeSubscription.ends_at) : null;
        const now = new Date();

        const totalDays = end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        const daysRemaining = end ? Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

        return (
            <AuthenticatedLayout header="Subscription">
                <Head title="Subscription" />

                <div className="max-w-2xl mx-auto space-y-6">
                    <Link
                        href={route('profile.edit')}
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Profile
                    </Link>

                    <Card padding="lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                <CheckCircleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-secondary-900 dark:text-white">
                                    {activeSubscription.plan?.name ?? 'Pro'} Plan
                                </h2>
                                <p className="text-sm text-secondary-500">Your subscription is active</p>
                            </div>
                            <Badge variant="success" size="lg" className="ml-auto">Active</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Started</p>
                                <p className="font-medium text-secondary-900 dark:text-white">
                                    {start.toLocaleDateString()}
                                </p>
                            </div>
                            {end && (
                                <div>
                                    <p className="text-secondary-500 dark:text-secondary-400">Expires</p>
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        {end.toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            {activeSubscription.plan && (
                                <div>
                                    <p className="text-secondary-500 dark:text-secondary-400">Plan</p>
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        {activeSubscription.plan.name}
                                    </p>
                                </div>
                            )}
                            {end && (
                                <div>
                                    <p className="text-secondary-500 dark:text-secondary-400">Days Remaining</p>
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        {daysRemaining} days
                                    </p>
                                </div>
                            )}
                        </div>

                        {end && totalDays > 0 && (
                            <ProgressBar
                                value={totalDays - daysRemaining}
                                max={totalDays}
                                variant={daysRemaining < 30 ? 'warning' : 'success'}
                                showLabel
                                label="Subscription Progress"
                            />
                        )}
                    </Card>

                    {/* Feature comparison */}
                    <Card padding="lg">
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5 text-amber-500" />
                            Your Pro Features
                        </h3>
                        <FeatureTable />
                    </Card>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Pending verification view
    if (latestSubscription && latestSubscription.status === 'pending_verification') {
        return (
            <AuthenticatedLayout header="Subscription">
                <Head title="Subscription" />

                <div className="max-w-2xl mx-auto space-y-6">
                    <Link
                        href={route('profile.edit')}
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Profile
                    </Link>

                    <Card padding="lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                <ClockIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-secondary-900 dark:text-white">Under Review</h2>
                                <p className="text-sm text-secondary-500">Your payment receipt is being verified</p>
                            </div>
                            <Badge variant="warning" size="lg" className="ml-auto">Pending</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            {latestSubscription.amount && (
                                <div>
                                    <p className="text-secondary-500 dark:text-secondary-400">Amount</p>
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        ₱{Number(latestSubscription.amount).toLocaleString()}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-secondary-500 dark:text-secondary-400">Submitted</p>
                                <p className="font-medium text-secondary-900 dark:text-white">
                                    {new Date(latestSubscription.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            {latestSubscription.plan && (
                                <div>
                                    <p className="text-secondary-500 dark:text-secondary-400">Plan</p>
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        {latestSubscription.plan.name}
                                    </p>
                                </div>
                            )}
                        </div>

                        {latestSubscription.receipt_path && (
                            <div className="rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-700">
                                <img
                                    src={`/storage/${latestSubscription.receipt_path}`}
                                    alt="Payment Receipt"
                                    className="w-full max-h-[300px] object-contain"
                                />
                            </div>
                        )}
                    </Card>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Rejected view — can re-submit
    const isRejected = latestSubscription && latestSubscription.status === 'rejected';

    // Free / Upgrade view
    return (
        <AuthenticatedLayout header="Subscription">
            <Head title="Subscription" />

            <div className="max-w-2xl mx-auto space-y-6">
                <Link
                    href={route('profile.edit')}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Profile
                </Link>

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

                {/* Plan cards */}
                {plans.length > 0 && (
                    <div className="space-y-4">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                padding="lg"
                                variant="elevated"
                                className={`cursor-pointer transition-all ${
                                    selectedPlan?.id === plan.id
                                        ? 'ring-2 ring-amber-500 dark:ring-amber-400'
                                        : 'hover:ring-1 hover:ring-secondary-300 dark:hover:ring-secondary-600'
                                }`}
                                onClick={() => handlePlanSelect(plan)}
                            >
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <SparklesIcon className="h-6 w-6 text-amber-500" />
                                        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                                            {plan.name}
                                        </h2>
                                        <ProBadge size="sm" />
                                    </div>
                                    {plan.description && (
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                            {plan.description}
                                        </p>
                                    )}
                                    <div className="flex items-baseline justify-center gap-1 mt-4">
                                        <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                            {plan.currency === 'PHP' ? '₱' : plan.currency}
                                            {Number(plan.price).toLocaleString()}
                                        </span>
                                        <span className="text-secondary-500">
                                            / {plan.billing_period}
                                        </span>
                                    </div>
                                    {plan.features && plan.features.length > 0 && (
                                        <ul className="mt-4 space-y-2 text-left">
                                            {plan.features.map((feat, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                                                    <CheckIcon className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {selectedPlan?.id === plan.id && (
                                        <div className="mt-3">
                                            <Badge variant="warning" size="sm">Selected</Badge>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Feature comparison */}
                <Card padding="lg">
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                        <SparklesIcon className="h-5 w-5 text-amber-500" />
                        Feature Comparison
                    </h3>
                    <FeatureTable />
                </Card>

                {/* Payment Form */}
                {selectedPlan && (
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
                                    <span className="text-secondary-600 dark:text-secondary-400">
                                        {selectedPlan.name} ({selectedPlan.billing_period})
                                    </span>
                                    <span className="text-secondary-900 dark:text-white">
                                        ₱{displayPrice.toLocaleString()}
                                    </span>
                                </div>
                                {couponResult?.valid && couponResult.discount ? (
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-success-600">Coupon Discount</span>
                                        <span className="text-success-600">-₱{couponResult.discount.toLocaleString()}</span>
                                    </div>
                                ) : null}
                                <div className="flex justify-between text-sm font-bold border-t border-secondary-200 dark:border-secondary-700 pt-2 mt-2">
                                    <span className="text-secondary-900 dark:text-white">Total</span>
                                    <span className="text-amber-600">₱{finalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {pageErrors?.subscription && (
                                <p className="text-sm text-danger-600">{pageErrors.subscription}</p>
                            )}

                            <button
                                type="submit"
                                disabled={processing || !data.receipt}
                                className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg hover:from-amber-500 hover:to-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <SparklesIcon className="h-5 w-5" />
                                {processing ? 'Submitting...' : 'Submit Payment & Upgrade'}
                            </button>
                        </form>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function FeatureTable() {
    return (
        <div className="border rounded-lg overflow-hidden divide-y divide-secondary-100 dark:divide-secondary-700 border-secondary-200 dark:border-secondary-700">
            <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-secondary-50 dark:bg-secondary-800/50 text-xs font-medium text-secondary-500 uppercase">
                <span>Feature</span>
                <span className="text-center">Free</span>
                <span className="text-center">Pro</span>
            </div>
            {features.map(({ feature, free, pro }) => (
                <div key={feature} className="grid grid-cols-3 gap-4 px-4 py-2.5 text-sm">
                    <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
                    <span className="text-center text-secondary-500">
                        {typeof free === 'boolean' ? (
                            free ? (
                                <CheckIcon className="h-4 w-4 text-success-500 inline" />
                            ) : (
                                <XMarkIcon className="h-4 w-4 text-secondary-300 dark:text-secondary-600 inline" />
                            )
                        ) : (
                            free
                        )}
                    </span>
                    <span className="text-center text-amber-600 font-medium">
                        {typeof pro === 'boolean' ? (
                            pro ? (
                                <CheckIcon className="h-4 w-4 text-amber-500 inline" />
                            ) : (
                                <XMarkIcon className="h-4 w-4 text-secondary-300 dark:text-secondary-600 inline" />
                            )
                        ) : (
                            pro
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
}
