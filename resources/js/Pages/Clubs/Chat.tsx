import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, Avatar } from '@/Components/UI';
import { Club } from '@/types/club';
import { FormEvent } from 'react';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ChatMessage {
    id: number;
    user_id: number;
    message: string;
    created_at: string;
    user?: {
        id: number;
        display_name: string;
        avatar?: string;
    };
}

interface ChatProps {
    club: Club;
    messages: { data: ChatMessage[] };
    hasChatAccess: boolean;
}

export default function ClubChat({ club, messages, hasChatAccess }: ChatProps) {
    const { data, setData, post, processing, reset } = useForm({ message: '' });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.message.trim()) return;
        post(route('clubs.chat.send', club.slug), {
            onSuccess: () => reset(),
        });
    };

    if (!hasChatAccess) {
        return (
            <AuthenticatedLayout header={`${club.name} — Chat`}>
                <Head title={`${club.name} Chat`} />
                <Link
                    href={route('clubs.show', club.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to {club.name}
                </Link>
                <Card>
                    <div className="text-center py-12">
                        <ChatBubbleLeftRightIcon className="h-16 w-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                            Chat is a Pro Feature
                        </h2>
                        <p className="text-secondary-500 dark:text-secondary-400 mt-2 max-w-md mx-auto">
                            Upgrade your club to Pro to unlock real-time chat for all members.
                        </p>
                    </div>
                </Card>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={`${club.name} — Chat`}>
            <Head title={`${club.name} Chat`} />

            <Link
                href={route('clubs.show', club.slug)}
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to {club.name}
            </Link>

            <div className="flex flex-col h-[calc(100vh-12rem)]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {messages.data.length > 0 ? (
                        [...messages.data].reverse().map((msg) => (
                            <div key={msg.id} className="flex items-start gap-3">
                                <Avatar name={msg.user?.display_name} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-secondary-900 dark:text-white">
                                            {msg.user?.display_name}
                                        </span>
                                        <span className="text-xs text-secondary-400">
                                            {new Date(msg.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary-700 dark:text-secondary-300 mt-0.5">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-sm text-secondary-500 dark:text-secondary-400 py-8">
                            No messages yet. Start the conversation!
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={submit} className="flex gap-2">
                    <input
                        type="text"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="flex-1 rounded-lg border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Type a message..."
                        maxLength={1000}
                    />
                    <button
                        type="submit"
                        disabled={processing || !data.message.trim()}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
