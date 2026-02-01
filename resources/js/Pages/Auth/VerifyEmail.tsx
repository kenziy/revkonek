import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Alert } from '@/Components/UI';
import { EnvelopeOpenIcon } from '@heroicons/react/24/outline';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-4">
                    <EnvelopeOpenIcon className="h-7 w-7 text-accent-600 dark:text-accent-400" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    Verify Your Email
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2 max-w-sm mx-auto">
                    Thanks for signing up! Please verify your email address by clicking the link we just sent you.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <Alert variant="success" className="mb-4">
                    A new verification link has been sent to your email address.
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-4">
                <PrimaryButton
                    className="w-full justify-center py-3"
                    disabled={processing}
                >
                    {processing ? 'Sending...' : 'Resend Verification Email'}
                </PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full"
                >
                    <SecondaryButton className="w-full justify-center py-3">
                        Log Out
                    </SecondaryButton>
                </Link>
            </form>
        </GuestLayout>
    );
}
