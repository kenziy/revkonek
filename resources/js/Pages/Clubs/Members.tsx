import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Avatar, Badge } from '@/Components/UI';
import { Club, ClubMember, CLUB_ROLE_LABELS, CLUB_ROLE_RANKS, CLUB_ROLE_COLORS, ClubRole } from '@/types/club';
import {
    ArrowLeftIcon,
    NoSymbolIcon,
    SpeakerXMarkIcon,
    SpeakerWaveIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

interface MembersProps {
    club: Club;
    members: { data: ClubMember[] };
    membership?: ClubMember | null;
    ownerId: number;
}

export default function ClubMembers({ club, members, membership, ownerId }: MembersProps) {
    const myRank = membership ? CLUB_ROLE_RANKS[membership.role] : 99;
    const canManageRoles = membership && (membership.role === 'president' || membership.role === 'vice_president');
    const canManageMembers = membership && membership.role !== 'member';

    const assignableRoles = (myRole: ClubRole): ClubRole[] => {
        const myR = CLUB_ROLE_RANKS[myRole];
        return (Object.keys(CLUB_ROLE_RANKS) as ClubRole[]).filter((r) => CLUB_ROLE_RANKS[r] > myR);
    };

    const canManageMember = (member: ClubMember) => {
        if (!canManageMembers) return false;
        if (member.user_id === ownerId) return false;
        const memberRank = CLUB_ROLE_RANKS[member.role];
        return memberRank > myRank;
    };

    return (
        <AuthenticatedLayout header={`${club.name} — Members`}>
            <Head title={`${club.name} Members`} />

            <div className="space-y-3">
                <Link
                    href={route('clubs.show', club.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to {club.name}
                </Link>

                {members.data.map((member) => (
                    <Card key={member.id}>
                        <div className="flex items-center gap-3">
                            <Link href={member.user?.uuid ? route('profile.show', member.user.uuid) : '#'}>
                                <Avatar name={member.user?.display_name} src={member.user?.avatar} size="md" className="hover:opacity-80 transition-opacity" />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={member.user?.uuid ? route('profile.show', member.user.uuid) : '#'}
                                        className="font-medium text-secondary-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {member.user?.display_name}
                                    </Link>
                                    <Badge variant={CLUB_ROLE_COLORS[member.role]} size="sm">
                                        {CLUB_ROLE_LABELS[member.role]}
                                    </Badge>
                                    {member.user_id === ownerId && (
                                        <Badge variant="primary" size="sm">Owner</Badge>
                                    )}
                                    {member.is_muted && <Badge variant="danger" size="sm">Muted</Badge>}
                                </div>
                                {member.joined_at && (
                                    <p className="text-xs text-secondary-400">
                                        Joined {new Date(member.joined_at).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            {canManageMember(member) && (
                                <div className="flex items-center gap-1">
                                    {canManageRoles && (
                                        <select
                                            value={member.role}
                                            onChange={(e) =>
                                                router.put(route('clubs.members.updateRole', [club.slug, member.user_id]), {
                                                    role: e.target.value,
                                                })
                                            }
                                            className="text-xs rounded border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white"
                                        >
                                            <option value={member.role}>{CLUB_ROLE_LABELS[member.role]}</option>
                                            {assignableRoles(membership!.role)
                                                .filter((r) => r !== member.role)
                                                .map((r) => (
                                                    <option key={r} value={r}>{CLUB_ROLE_LABELS[r]}</option>
                                                ))}
                                        </select>
                                    )}
                                    <button
                                        onClick={() => router.post(route(
                                            member.is_muted ? 'clubs.members.unmute' : 'clubs.members.mute',
                                            [club.slug, member.user_id]
                                        ))}
                                        className="p-2 rounded-lg text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                                        title={member.is_muted ? 'Unmute' : 'Mute'}
                                    >
                                        {member.is_muted ? (
                                            <SpeakerWaveIcon className="h-4 w-4" />
                                        ) : (
                                            <SpeakerXMarkIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => router.post(route('clubs.members.block', [club.slug, member.user_id]))}
                                        className="p-2 rounded-lg text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                                        title="Block"
                                    >
                                        <NoSymbolIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => router.delete(route('clubs.members.remove', [club.slug, member.user_id]))}
                                        className="p-2 rounded-lg text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                                        title="Remove"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}

                {members.data.length === 0 && (
                    <Card>
                        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 py-8">
                            No members yet.
                        </p>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
