import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/Components/UI';
import { Club } from '@/types/club';
import { FormEvent } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface CreateProps {
    club: Club;
}

export default function ClubEventCreate({ club }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'meetup',
        title: '',
        description: '',
        location_name: '',
        starts_at: '',
        ends_at: '',
        max_attendees: '',
        route_link: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('clubs.events.store', club.slug));
    };

    return (
        <AuthenticatedLayout header="Create Event">
            <Head title={`Create Event — ${club.name}`} />

            <div className="max-w-2xl mx-auto space-y-4">
                <Link
                    href={route('clubs.events', club.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Events
                </Link>

                <Card padding="lg">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Event Type *
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="meetup">Meetup</option>
                                <option value="ride">Ride</option>
                                <option value="track_day">Track Day</option>
                                <option value="workshop">Workshop</option>
                            </select>
                            {errors.type && <p className="text-sm text-danger-600 mt-1">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g. Sunday morning ride to Tagaytay"
                            />
                            {errors.title && <p className="text-sm text-danger-600 mt-1">{errors.title}</p>}
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
                                placeholder="Event details..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                value={data.location_name}
                                onChange={(e) => setData('location_name', e.target.value)}
                                className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g. Shell Gas Station, SLEX Southbound"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                    Starts At *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) => setData('starts_at', e.target.value)}
                                    className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                />
                                {errors.starts_at && <p className="text-sm text-danger-600 mt-1">{errors.starts_at}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                    Ends At
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.ends_at}
                                    onChange={(e) => setData('ends_at', e.target.value)}
                                    className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        {data.type === 'ride' && (
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                    Route Link
                                </label>
                                <input
                                    type="url"
                                    value={data.route_link}
                                    onChange={(e) => setData('route_link', e.target.value)}
                                    className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. https://asaka.app/route/..."
                                />
                                <p className="text-xs text-secondary-400 mt-1">
                                    Link to the ride route (asaka.app, Google Maps, etc.)
                                </p>
                                {errors.route_link && <p className="text-sm text-danger-600 mt-1">{errors.route_link}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                Max Attendees
                            </label>
                            <input
                                type="number"
                                value={data.max_attendees}
                                onChange={(e) => setData('max_attendees', e.target.value)}
                                className="w-full rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Leave empty for unlimited"
                                min={2}
                            />
                        </div>

                        {(errors as any).tier && (
                            <p className="text-sm text-danger-600">{(errors as any).tier}</p>
                        )}

                        <div className="flex justify-end gap-3">
                            <a
                                href={route('clubs.events', club.slug)}
                                className="px-6 py-3 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg font-semibold text-sm transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-800"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
