import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import ThemeToggle from '@/Components/UI/ThemeToggle';
import { Footer } from '@/Components/UI';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div
            className={clsx(
                'flex min-h-screen flex-col',
                'bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900',
                'dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-950'
            )}
        >
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>

            <div className="absolute inset-0 bg-racing-pattern opacity-5" />

            <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-3 mb-2"
                        >
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 shadow-lg shadow-primary-600/30">
                                <span className="text-2xl font-bold text-white">RK</span>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-white">REV KONEK</h1>
                        <p className="text-secondary-400 text-sm mt-1">
                            Connect. Ride. Share.
                        </p>
                    </div>

                    <div
                        className={clsx(
                            'w-full overflow-hidden rounded-2xl',
                            'bg-white dark:bg-secondary-800',
                            'shadow-2xl shadow-black/20',
                            'border border-secondary-200 dark:border-secondary-700'
                        )}
                    >
                        <div className="px-6 py-8 sm:px-8">{children}</div>
                    </div>

                    <p className="mt-6 text-center text-sm text-secondary-400">
                        By continuing, you agree to our{' '}
                        <Link
                            href="#"
                            className="text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="#"
                            className="text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>

            <Footer className="relative z-10" />
        </div>
    );
}
