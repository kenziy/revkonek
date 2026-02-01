import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Alert } from '@/Components/UI';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                    <EnvelopeIcon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    Forgot Password?
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2 max-w-sm mx-auto">
                    No problem. Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            {status && (
                <Alert variant="success" className="mb-4">
                    {status}
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5"
                        isFocused={true}
                        placeholder="rider@example.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <PrimaryButton
                    className="w-full justify-center py-3"
                    disabled={processing}
                >
                    {processing ? 'Sending...' : 'Send Reset Link'}
                </PrimaryButton>

                <p className="text-center text-sm text-secondary-600 dark:text-secondary-400">
                    Remember your password?{' '}
                    <Link
                        href={route('login')}
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                    >
                        Back to login
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
