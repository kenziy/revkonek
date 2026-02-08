import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Avatar, Badge } from '@/Components/UI';
import { Club, ClubEvent, ClubEventRsvp, ClubMember } from '@/types/club';
import { useState } from 'react';
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    MapPinIcon,
    LinkIcon,
    UserGroupIcon,
    ClockIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface ShowProps {
    club: Club;
    event: ClubEvent;
    userRsvp?: ClubEventRsvp | null;
    attendance: number[];
    clubMembers: ClubMember[];
    canManage: boolean;
    isPastEvent: boolean;
}

export default function ClubEventShow({ club, event, userRsvp, attendance, clubMembers, canManage, isPastEvent }: ShowProps) {
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>(attendance);
    const [saving, setSaving] = useState(false);

    const rsvpOptions = [
        { value: 'going', label: 'Going', color: 'bg-success-600' },
        { value: 'maybe', label: 'Maybe', color: 'bg-warning-600' },
        { value: 'not_going', label: "Can't Go", color: 'bg-secondary-400' },
    ] as const;

    const handleRsvp = (status: string) => {
        router.post(route('clubs.events.rsvp', [club.slug, event.id]), { status });
    };

    const eventTypeBadge = (type: string) => {
        switch (type) {
            case 'ride': return 'primary';
            case 'meetup': return 'success';
            case 'track_day': return 'warning';
            case 'workshop': return 'info';
            default: return 'secondary';
        }
    };

    const toggleAttendance = (userId: number) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const saveAttendance = () => {
        setSaving(true);
        router.post(
            route('clubs.events.attendance', [club.slug, event.id]),
            { user_ids: selectedUserIds },
            { onFinish: () => setSaving(false) }
        );
    };

    // Sort: RSVP "going" first, then others
    const goingUserIds = new Set(
        event.rsvps?.filter((r) => r.status === 'going').map((r) => r.user_id) ?? []
    );
    const sortedMembers = [...clubMembers].sort((a, b) => {
        const aGoing = goingUserIds.has(a.user_id) ? 0 : 1;
        const bGoing = goingUserIds.has(b.user_id) ? 0 : 1;
        return aGoing - bGoing;
    });

    return (
        <AuthenticatedLayout>
            <Head title={event.title} />

            <div className="space-y-6">
                <Link
                    href={route('clubs.events', club.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Events
                </Link>

                {/* Event header */}
                <Card padding="lg">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={eventTypeBadge(event.type)} size="sm">
                            {event.type.replace('_', ' ')}
                        </Badge>
                        {event.is_cancelled && <Badge variant="danger" size="sm">Cancelled</Badge>}
                    </div>

                    <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                        {event.title}
                    </h1>

                    {event.description && (
                        <p className="text-secondary-600 dark:text-secondary-400 mt-2 whitespace-pre-wrap">
                            {event.description}
                        </p>
                    )}

                    <div className="mt-4 space-y-2 text-sm text-secondary-500 dark:text-secondary-400">
                        <div className="flex items-center gap-2">
                            <CalendarDaysIcon className="h-5 w-5" />
                            <span>
                                {new Date(event.starts_at).toLocaleDateString('en', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="h-5 w-5" />
                            <span>
                                {new Date(event.starts_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                                {event.ends_at && ` — ${new Date(event.ends_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}`}
                            </span>
                        </div>
                        {event.location_name && (
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-5 w-5" />
                                <span>{event.location_name}</span>
                            </div>
                        )}
                        {event.route_link && (
                            <div className="flex items-center gap-2">
                                <LinkIcon className="h-5 w-5" />
                                <a
                                    href={event.route_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    View Route
                                </a>
                            </div>
                        )}
                        {event.max_attendees && (
                            <div className="flex items-center gap-2">
                                <UserGroupIcon className="h-5 w-5" />
                                <span>
                                    {event.rsvps?.filter(r => r.status === 'going').length ?? 0} / {event.max_attendees} spots
                                </span>
                            </div>
                        )}
                    </div>

                    {event.creator && (
                        <p className="text-xs text-secondary-400 mt-3">
                            Created by {event.creator.display_name}
                        </p>
                    )}
                </Card>

                {/* RSVP */}
                {!event.is_cancelled && (
                    <Card padding="lg">
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">
                            RSVP
                        </h3>
                        <div className="flex gap-2">
                            {rsvpOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleRsvp(opt.value)}
                                    className={clsx(
                                        'flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all',
                                        userRsvp?.status === opt.value
                                            ? `${opt.color} text-white`
                                            : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Attendees */}
                {event.rsvps && event.rsvps.length > 0 && (
                    <Card>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">
                            Attendees ({event.rsvps.filter(r => r.status === 'going').length})
                        </h3>
                        <div className="space-y-2">
                            {event.rsvps
                                .filter((r) => r.status === 'going')
                                .map((rsvp) => (
                                    <div key={rsvp.id} className="flex items-center gap-3">
                                        <Avatar name={rsvp.user?.display_name} size="sm" />
                                        <span className="text-sm text-secondary-900 dark:text-white">
                                            {rsvp.user?.display_name}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </Card>
                )}

                {/* Mark Attendance — admin/mod only, past events */}
                {canManage && isPastEvent && !event.is_cancelled && (
                    <Card padding="lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                                <CheckCircleIcon className="h-5 w-5 text-success-500" />
                                Mark Attendance
                            </h3>
                            <Badge variant="success" size="sm">10 pts each</Badge>
                        </div>

                        {sortedMembers.length > 0 ? (
                            <div className="space-y-1 max-h-80 overflow-y-auto">
                                {sortedMembers.map((m) => {
                                    const isChecked = selectedUserIds.includes(m.user_id);
                                    const isGoing = goingUserIds.has(m.user_id);
                                    return (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => toggleAttendance(m.user_id)}
                                            className={clsx(
                                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left',
                                                isChecked
                                                    ? 'bg-success-50 dark:bg-success-900/20'
                                                    : 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                                            )}
                                        >
                                            {isChecked ? (
                                                <CheckCircleSolid className="h-5 w-5 text-success-500 flex-shrink-0" />
                                            ) : (
                                                <div className="h-5 w-5 rounded-full border-2 border-secondary-300 dark:border-secondary-600 flex-shrink-0" />
                                            )}
                                            <Avatar
                                                src={m.user?.avatar}
                                                name={m.user?.display_name}
                                                size="sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                                                    {m.user?.display_name}
                                                </p>
                                            </div>
                                            {isGoing && (
                                                <Badge variant="success" size="sm">RSVP'd</Badge>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-secondary-400">No club members found.</p>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-xs text-secondary-400">
                                {selectedUserIds.length} member{selectedUserIds.length !== 1 ? 's' : ''} attended
                            </p>
                            <button
                                onClick={saveAttendance}
                                disabled={saving}
                                className="px-5 py-2 bg-success-600 hover:bg-success-500 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors"
                            >
                                {saving ? 'Saving...' : 'Save Attendance'}
                            </button>
                        </div>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
