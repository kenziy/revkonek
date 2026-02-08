import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Badge } from '@/Components/UI';
import { Club, ClubMember, ClubEvent } from '@/types/club';
import { ArrowLeftIcon, MapPinIcon, CalendarDaysIcon, LinkIcon } from '@heroicons/react/24/outline';

interface EventsProps {
    club: Club;
    events: { data: ClubEvent[] };
    membership?: ClubMember | null;
}

export default function ClubEvents({ club, events, membership }: EventsProps) {
    const canCreate = membership && membership.role !== 'member';

    const eventTypeBadge = (type: string) => {
        switch (type) {
            case 'ride': return 'primary';
            case 'meetup': return 'success';
            case 'track_day': return 'warning';
            case 'workshop': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <AuthenticatedLayout header={`${club.name} — Events`}>
            <Head title={`${club.name} Events`} />

            <div className="space-y-4">
                <Link
                    href={route('clubs.show', club.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to {club.name}
                </Link>

                {canCreate && (
                    <Link
                        href={route('clubs.events.create', club.slug)}
                        className="block text-center py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                        Create Event
                    </Link>
                )}

                {events.data.map((event) => (
                    <Link key={event.id} href={route('clubs.events.show', [club.slug, event.id])}>
                        <Card hoverable className="mb-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex flex-col items-center justify-center">
                                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase">
                                        {new Date(event.starts_at).toLocaleDateString('en', { month: 'short' })}
                                    </span>
                                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400 leading-none">
                                        {new Date(event.starts_at).getDate()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                                            {event.title}
                                        </h3>
                                        <Badge variant={eventTypeBadge(event.type)} size="sm">
                                            {event.type.replace('_', ' ')}
                                        </Badge>
                                        {event.is_cancelled && <Badge variant="danger" size="sm">Cancelled</Badge>}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-secondary-400">
                                        <span className="flex items-center gap-1">
                                            <CalendarDaysIcon className="h-3.5 w-3.5" />
                                            {new Date(event.starts_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {event.location_name && (
                                            <span className="flex items-center gap-1">
                                                <MapPinIcon className="h-3.5 w-3.5" />
                                                {event.location_name}
                                            </span>
                                        )}
                                        {event.route_link && (
                                            <span className="flex items-center gap-1 text-primary-500">
                                                <LinkIcon className="h-3.5 w-3.5" />
                                                Route
                                            </span>
                                        )}
                                    </div>
                                    {event.rsvps_count !== undefined && (
                                        <p className="text-xs text-secondary-400 mt-1">
                                            {event.rsvps_count} attending
                                            {event.max_attendees ? ` / ${event.max_attendees} max` : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}

                {events.data.length === 0 && (
                    <Card>
                        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 py-8">
                            No events yet.
                        </p>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
