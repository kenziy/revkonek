import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Badge } from '@/Components/UI';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Select from '@/Components/Form/Select';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { SubscriptionPlan } from '@/types/admin';

interface Props {
    plans: SubscriptionPlan[];
}

function PlanForm({
    plan,
    onCancel,
}: {
    plan?: SubscriptionPlan;
    onCancel: () => void;
}) {
    const [data, setDataRaw] = useState(() => ({
        name: plan?.name ?? '',
        slug: plan?.slug ?? '',
        description: plan?.description ?? '',
        price: plan?.price != null ? String(plan.price) : '',
        currency: plan?.currency ?? 'PHP',
        billing_period: plan?.billing_period ?? 'monthly',
        features: Array.isArray(plan?.features) ? plan.features.join('\n') : '',
        is_active: plan?.is_active ?? true,
    }));
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const setData = (key: string, value: string | boolean) => {
        setDataRaw((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...data,
            price: parseFloat(data.price) || 0,
            features: data.features
                .split('\n')
                .map((f: string) => f.trim())
                .filter(Boolean),
        };

        setProcessing(true);
        const method = plan ? 'put' : 'post';
        const url = plan
            ? route('admin.subscriptions.plans.update', plan.id)
            : route('admin.subscriptions.plans.store');

        router[method](url, payload, {
            onSuccess: () => {
                setProcessing(false);
                onCancel();
            },
            onError: (errs) => {
                setProcessing(false);
                setErrors(errs);
            },
        });
    };

    const autoSlug = (name: string) => {
        setDataRaw((prev) => ({
            ...prev,
            name,
            ...(!plan ? { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {}),
        }));
    };

    return (
        <Card>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                {plan ? 'Edit Plan' : 'Create New Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="name" value="Plan Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => autoSlug(e.target.value)}
                            className="mt-1"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="slug" value="Slug" />
                        <TextInput
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="mt-1"
                        />
                        <InputError message={errors.slug} className="mt-1" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="description" value="Description" />
                    <TextInput
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1"
                    />
                    <InputError message={errors.description} className="mt-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <InputLabel htmlFor="price" value="Price" />
                        <TextInput
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="mt-1"
                        />
                        <InputError message={errors.price} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="currency" value="Currency" />
                        <TextInput
                            id="currency"
                            value={data.currency}
                            onChange={(e) => setData('currency', e.target.value)}
                            maxLength={3}
                            className="mt-1"
                        />
                        <InputError message={errors.currency} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="billing_period" value="Billing Period" />
                        <Select
                            id="billing_period"
                            options={[
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'yearly', label: 'Yearly' },
                            ]}
                            value={data.billing_period}
                            onChange={(e) => setData('billing_period', e.target.value as 'monthly' | 'yearly')}
                            className="mt-1"
                        />
                        <InputError message={errors.billing_period} className="mt-1" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="features" value="Features (one per line)" />
                    <textarea
                        id="features"
                        value={data.features}
                        onChange={(e) => setData('features', e.target.value)}
                        rows={4}
                        className="mt-1 w-full rounded-lg border border-secondary-300 bg-white px-4 py-3 text-sm text-secondary-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100"
                        placeholder="Multi-photo gallery&#10;Layout templates&#10;Background music"
                    />
                    <InputError message={errors.features} className="mt-1" />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-800"
                    />
                    <InputLabel htmlFor="is_active" value="Active" />
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                        {processing ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
                    </button>
                </div>
            </form>
        </Card>
    );
}

export default function SubscriptionPlans({ plans }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | undefined>(undefined);

    const handleEdit = (plan: SubscriptionPlan) => {
        setEditingPlan(plan);
        setShowForm(true);
    };

    const handleDelete = (plan: SubscriptionPlan) => {
        if (confirm(`Are you sure you want to delete the "${plan.name}" plan?`)) {
            router.delete(route('admin.subscriptions.plans.destroy', plan.id));
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingPlan(undefined);
    };

    return (
        <AdminLayout header="Subscription Plans">
            <Head title="Admin - Subscription Plans" />

            <div className="space-y-6">
                {!showForm && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <PlusIcon className="h-4 w-4" />
                            New Plan
                        </button>
                    </div>
                )}

                {showForm && (
                    <PlanForm key={editingPlan?.id ?? 'new'} plan={editingPlan} onCancel={handleCancel} />
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.id}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                                        {plan.name}
                                    </h3>
                                    <p className="text-xs text-secondary-500 mt-0.5">{plan.slug}</p>
                                </div>
                                <Badge variant={plan.is_active ? 'success' : 'secondary'} size="sm">
                                    {plan.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            {plan.description && (
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                                    {plan.description}
                                </p>
                            )}

                            <div className="mb-3">
                                <span className="text-2xl font-bold text-secondary-900 dark:text-white">
                                    {plan.currency} {Number(plan.price).toLocaleString()}
                                </span>
                                <span className="text-sm text-secondary-500 ml-1">
                                    / {plan.billing_period}
                                </span>
                            </div>

                            {plan.features && plan.features.length > 0 && (
                                <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1 mb-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-1.5">
                                            <span className="text-success-500">&#10003;</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex gap-2 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(plan)}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400 transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </Card>
                    ))}

                    {plans.length === 0 && !showForm && (
                        <Card className="sm:col-span-2 lg:col-span-3">
                            <div className="text-center py-8">
                                <p className="text-secondary-500 dark:text-secondary-400">
                                    No subscription plans yet. Create your first plan to get started.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
