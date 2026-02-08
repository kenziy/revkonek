import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card } from '@/Components/UI';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function ClubCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        type: 'public',
        requires_approval: false,
        city: '',
        province: '',
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const checkSlugAvailability = useCallback((slug: string) => {
        if (!slug || slug.length < 2) {
            setSlugStatus('idle');
            return;
        }

        setSlugStatus('checking');

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                const { data: result } = await axios.post(route('clubs.checkSlug'), { slug });
                setSlugStatus(result.available ? 'available' : 'taken');
            } catch {
                setSlugStatus('idle');
            }
        }, 400);
    }, []);

    // Auto-generate slug from name (only if not manually edited)
    useEffect(() => {
        if (!slugManuallyEdited) {
            const generated = slugify(data.name);
            setData('slug', generated);
            checkSlugAvailability(generated);
        }
    }, [data.name]);

    const handleSlugChange = (value: string) => {
        const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
        setSlugManuallyEdited(true);
        setData('slug', sanitized);
        checkSlugAvailability(sanitized);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('clubs.store'));
    };

    return (
        <AuthenticatedLayout header="Create Club">
            <Head title="Create Club" />

            <div className="max-w-2xl mx-auto">
                <Card padding="lg">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Club Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g. Manila Riders Club"
                            />
                            {errors.name && <p className="text-sm text-danger-600 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Club Handle (slug) *
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-400 text-sm pointer-events-none">
                                    /clubs/
                                </span>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500 pl-16 pr-10"
                                    placeholder="manila-riders-club"
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {slugStatus === 'checking' && (
                                        <svg className="animate-spin h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    {slugStatus === 'available' && (
                                        <CheckCircleIcon className="h-5 w-5 text-success-500" />
                                    )}
                                    {slugStatus === 'taken' && (
                                        <XCircleIcon className="h-5 w-5 text-danger-500" />
                                    )}
                                </span>
                            </div>
                            {slugStatus === 'taken' && (
                                <p className="text-sm text-danger-600 mt-1">This slug is already taken.</p>
                            )}
                            {slugStatus === 'available' && (
                                <p className="text-sm text-success-600 mt-1">This slug is available!</p>
                            )}
                            {errors.slug && <p className="text-sm text-danger-600 mt-1">{errors.slug}</p>}
                            <p className="text-xs text-secondary-400 mt-1">
                                Only lowercase letters, numbers, and hyphens. This will be your club's unique URL.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Tell riders what your club is about..."
                            />
                            {errors.description && <p className="text-sm text-danger-600 mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Club Type *
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="public">Public — Anyone can join</option>
                                <option value="private">Private — Request to join</option>
                                <option value="secret">Secret — Invite only</option>
                            </select>
                            {errors.type && <p className="text-sm text-danger-600 mt-1">{errors.type}</p>}
                        </div>

                        {data.type !== 'private' && (
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                        Require Join Approval
                                    </label>
                                    <p className="text-xs text-secondary-400 mt-0.5">
                                        New members must be approved before joining.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('requires_approval', !data.requires_approval)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        data.requires_approval ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            data.requires_approval ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. Manila"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                    Province
                                </label>
                                <input
                                    type="text"
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. Metro Manila"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing || slugStatus === 'taken'}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Club'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
