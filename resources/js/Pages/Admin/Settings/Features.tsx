import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/UI';
import Switch from '@/Components/Form/Switch';

interface Props {
    features: {
        sos_enabled: boolean;
    };
}

const featureInfo = [
    {
        key: 'sos_enabled' as const,
        name: 'SOS / Emergency',
        description:
            'Allow users to use the emergency SOS system and manage emergency contacts. Disabling hides SOS from navigation and dashboard.',
    },
];

export default function Features({ features }: Props) {
    const { data, setData, put, processing } = useForm({
        sos_enabled: features.sos_enabled,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.settings.features.update'));
    };

    return (
        <AdminLayout header="Feature Flags">
            <Head title="Admin - Feature Flags" />

            <div className="flex gap-4 mb-6">
                <Link
                    href={route('admin.settings.index')}
                    className="px-4 py-2 text-sm font-medium text-secondary-600 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600 transition-colors"
                >
                    App Settings
                </Link>
                <Link
                    href={route('admin.settings.staff')}
                    className="px-4 py-2 text-sm font-medium text-secondary-600 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600 transition-colors"
                >
                    Staff Management
                </Link>
                <Link
                    href={route('admin.settings.features')}
                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg"
                >
                    Features
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
                        Feature Flags
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
                        Enable or disable major features across the platform. Disabled features are hidden from navigation and inaccessible to users.
                    </p>

                    <div className="space-y-6">
                        {featureInfo.map((feature) => (
                            <div
                                key={feature.key}
                                className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/50"
                            >
                                <Switch
                                    checked={data[feature.key]}
                                    onChange={(checked) => setData(feature.key, checked)}
                                    label={feature.name}
                                    description={feature.description}
                                    size="lg"
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                    Save Feature Flags
                </button>
            </form>
        </AdminLayout>
    );
}
