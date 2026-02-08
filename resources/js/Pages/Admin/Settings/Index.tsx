import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/UI';
import TextInput from '@/Components/TextInput';
import { SystemSetting } from '@/types/admin';

interface Props {
    settings: Record<string, SystemSetting[]>;
}

export default function SettingsIndex({ settings }: Props) {
    const allSettings = Object.values(settings).flat();
    const { data, setData, put, processing } = useForm({
        settings: allSettings.map((s) => ({ id: s.id, value: s.value || '' })),
    });

    const updateValue = (id: number, value: string) => {
        setData('settings', data.settings.map((s) => (s.id === id ? { ...s, value } : s)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.settings.update'));
    };

    const groups = Object.keys(settings);

    return (
        <AdminLayout header="Settings">
            <Head title="Admin - Settings" />

            <div className="flex gap-4 mb-6">
                <Link
                    href={route('admin.settings.index')}
                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg"
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
                    className="px-4 py-2 text-sm font-medium text-secondary-600 bg-secondary-100 rounded-lg hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600 transition-colors"
                >
                    Features
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <Card key={group} className="mb-6">
                            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4 capitalize">
                                {group.replace(/_/g, ' ')}
                            </h3>
                            <div className="space-y-4">
                                {settings[group].map((setting) => {
                                    const formSetting = data.settings.find((s) => s.id === setting.id);
                                    return (
                                        <div key={setting.id}>
                                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                                {setting.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </label>
                                            {setting.description && (
                                                <p className="text-xs text-secondary-500 mb-1">{setting.description}</p>
                                            )}
                                            <TextInput
                                                value={formSetting?.value || ''}
                                                onChange={(e) => updateValue(setting.id, e.target.value)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <p className="text-center text-secondary-500 dark:text-secondary-400 py-8">
                            No system settings configured. Settings will appear here once they are added to the system_settings table.
                        </p>
                    </Card>
                )}

                {groups.length > 0 && (
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                        Save Settings
                    </button>
                )}
            </form>
        </AdminLayout>
    );
}
