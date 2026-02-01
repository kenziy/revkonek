import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { PasswordStrength } from '@/Components/Form';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                    <LockClosedIcon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    Reset Password
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">
                    Create a new secure password for your account
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5"
                        autoComplete="new-password"
                        isFocused={true}
                        placeholder="Enter new password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                    {data.password && (
                        <PasswordStrength password={data.password} className="mt-3" />
                    )}
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm New Password"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1.5"
                        autoComplete="new-password"
                        placeholder="Confirm new password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <PrimaryButton
                    className="w-full justify-center py-3"
                    disabled={processing}
                >
                    {processing ? 'Resetting...' : 'Reset Password'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
