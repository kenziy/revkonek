import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

function SpeedometerIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
    );
}

function MotorcycleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="2"/>
            <path d="M5.5 17.5h3l2-5h4l1.5 2.5h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 12.5l1-3h3l1 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.5 9.5l2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

function FlagIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12z" fill="currentColor"/>
            <path d="M4 22v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

function ShieldIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function ShopIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function AlertIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
        </svg>
    );
}

function HeartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

const stats = [
    { value: '10K+', label: 'Active Riders' },
    { value: '500+', label: 'Challenges Completed' },
    { value: '50+', label: 'Cities Connected' },
    { value: '24/7', label: 'SOS Support' },
];

const features = [
    {
        icon: FlagIcon,
        title: 'Challenge Mode',
        description: 'Race against other riders, submit results with proof, and climb the leaderboards. Dispute system ensures fair play.',
        color: 'from-primary-500 to-primary-600',
    },
    {
        icon: UsersIcon,
        title: 'Group Rides',
        description: 'Join or create riding groups, plan epic routes together, and share the thrill with fellow enthusiasts.',
        color: 'from-accent-500 to-accent-600',
    },
    {
        icon: AlertIcon,
        title: 'SOS Emergency',
        description: 'One-tap emergency alerts to your trusted contacts with your live location. Because safety comes first.',
        color: 'from-danger-500 to-danger-600',
    },
    {
        icon: ShopIcon,
        title: 'Marketplace',
        description: 'Buy, sell, or trade parts and gear with verified riders. Find that rare exhaust or sell your upgrades.',
        color: 'from-success-500 to-success-600',
    },
    {
        icon: HeartIcon,
        title: 'Rider Matchmaking',
        description: 'Find your perfect riding buddy based on skill level, bike type, and riding schedule. Never ride alone.',
        color: 'from-pink-500 to-pink-600',
    },
    {
        icon: SpeedometerIcon,
        title: 'Stats & Rankings',
        description: 'Track your performance, view detailed statistics, and see how you stack up against the competition.',
        color: 'from-blue-500 to-blue-600',
    },
];

const testimonials = [
    {
        quote: "Finally, an app that gets what riders need. The challenge system is addictive!",
        author: "Marco D.",
        role: "Weekend Warrior",
        avatar: "M",
    },
    {
        quote: "The SOS feature saved me when I had a breakdown in the province. My contacts knew exactly where I was.",
        author: "Rica S.",
        role: "Long Distance Rider",
        avatar: "R",
    },
    {
        quote: "Found my dream exhaust on the marketplace for half the price. Legit sellers only!",
        author: "Jay T.",
        role: "Modifier",
        avatar: "J",
    },
];

export default function Welcome({ auth }: PageProps) {
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="REV KONEK - Connect. Ride. Compete." />

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md shadow-soft'
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                <MotorcycleIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight ${
                                scrolled ? 'text-secondary-900 dark:text-white' : 'text-white'
                            }`}>
                                REV KONEK
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="btn-primary"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                                            scrolled
                                                ? 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-white'
                                                : 'text-white/90 hover:text-white'
                                        }`}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="btn-primary"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary-900">
                {/* YouTube Video Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 scale-150">
                        <iframe
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] min-w-[200vw] min-h-[200vh] pointer-events-none"
                            src="https://www.youtube.com/embed/rgyh4BzFxrk?autoplay=1&mute=1&loop=1&playlist=rgyh4BzFxrk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=*"
                            title="Background Video"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-secondary-900/70" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/50 via-transparent to-secondary-900" />
                    {/* Racing stripe pattern overlay */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 22px)'
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
                            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                            Join the fastest-growing rider community
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            <span className="block">Connect.</span>
                            <span className="block text-gradient bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Ride.</span>
                            <span className="block">Compete.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-secondary-300 max-w-2xl mx-auto mb-10">
                            The ultimate platform for motorcycle enthusiasts. Challenge riders, join group rides,
                            stay safe with SOS, and trade gear — all in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={route('register')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:scale-105"
                            >
                                Start Your Journey
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <a
                                href="#features"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <ChevronDownIcon className="w-8 h-8 text-white/50" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative -mt-16 z-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="card p-6 text-center animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-secondary-500 dark:text-secondary-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white dark:bg-secondary-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                            Everything You Need to{' '}
                            <span className="text-gradient bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                                Ride Better
                            </span>
                        </h2>
                        <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
                            Built by riders, for riders. Every feature designed to enhance your riding experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group card p-6 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Challenge CTA Section */}
            <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, white 50px, white 52px)',
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white/90 text-sm font-medium mb-6">
                                <FlagIcon className="w-4 h-4" />
                                Challenge Mode
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Ready to Prove You're the Fastest?
                            </h2>
                            <p className="text-lg text-white/80 mb-8">
                                Challenge other riders to races, submit your times with video proof,
                                and climb the leaderboards. Our dispute system ensures every race is fair.
                                May the best rider win!
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-white/90">
                                    <ShieldIcon className="w-5 h-5" />
                                    <span>Verified Results</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <UsersIcon className="w-5 h-5" />
                                    <span>Witness System</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <SpeedometerIcon className="w-5 h-5" />
                                    <span>Live Rankings</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-accent-400 flex items-center justify-center text-xl font-bold text-secondary-900">
                                        1
                                    </div>
                                    <div className="flex-1 h-1 bg-white/20 rounded-full">
                                        <div className="h-full w-3/4 bg-accent-400 rounded-full" />
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold text-white">
                                        2
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-accent-400 flex items-center justify-center font-bold text-secondary-900">
                                                M
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">Marco D.</div>
                                                <div className="text-sm text-white/60">Yamaha R15</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-accent-400">1:23.45</div>
                                            <div className="text-xs text-white/60">Best Time</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary-500 flex items-center justify-center font-bold text-white">
                                                J
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">Jay T.</div>
                                                <div className="text-sm text-white/60">Honda CBR</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-white">1:25.12</div>
                                            <div className="text-xs text-white/60">Best Time</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10 text-center text-white/60 text-sm">
                                    Challenge ends in 2h 34m
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-secondary-50 dark:bg-secondary-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                            What Riders Are Saying
                        </h2>
                        <p className="text-lg text-secondary-600 dark:text-secondary-400">
                            Join thousands of satisfied riders on REV KONEK
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="card p-8 md:p-12 text-center relative">
                            <div className="text-6xl text-primary-200 dark:text-primary-800 absolute top-6 left-6">
                                "
                            </div>
                            <div className="relative z-10">
                                <p className="text-xl md:text-2xl text-secondary-700 dark:text-secondary-300 mb-8 leading-relaxed">
                                    {testimonials[activeTestimonial].quote}
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-xl font-bold text-white">
                                        {testimonials[activeTestimonial].avatar}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-secondary-900 dark:text-white">
                                            {testimonials[activeTestimonial].author}
                                        </div>
                                        <div className="text-sm text-secondary-500 dark:text-secondary-400">
                                            {testimonials[activeTestimonial].role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        index === activeTestimonial
                                            ? 'bg-primary-500 w-8'
                                            : 'bg-secondary-300 dark:bg-secondary-600 hover:bg-secondary-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SOS Section */}
            <section className="py-24 bg-white dark:bg-secondary-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative">
                                <div className="card p-8 text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-danger-500 to-danger-600 flex items-center justify-center animate-pulse-soft">
                                        <AlertIcon className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                                        Emergency SOS
                                    </h3>
                                    <p className="text-secondary-500 dark:text-secondary-400 mb-6">
                                        One tap to alert your emergency contacts
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-800">
                                            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">3</div>
                                            <div className="text-xs text-secondary-500">Contacts Alerted</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-800">
                                            <div className="text-2xl font-bold text-success-600 dark:text-success-400">Live</div>
                                            <div className="text-xs text-secondary-500">Location Shared</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-800">
                                            <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">24/7</div>
                                            <div className="text-xs text-secondary-500">Monitoring</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative rings */}
                                <div className="absolute -inset-4 border-2 border-dashed border-danger-200 dark:border-danger-900 rounded-3xl -z-10" />
                                <div className="absolute -inset-8 border-2 border-dashed border-danger-100 dark:border-danger-950 rounded-3xl -z-10" />
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 text-sm font-medium mb-6">
                                <ShieldIcon className="w-4 h-4" />
                                Safety First
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
                                Ride With Confidence
                            </h2>
                            <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-8 leading-relaxed">
                                Accidents happen. When they do, REV KONEK has your back. With a single tap,
                                alert your trusted contacts with your exact location. They'll see your real-time
                                position until you're safe.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Instant alerts to up to 5 emergency contacts',
                                    'Real-time GPS location sharing',
                                    'Medical profile for first responders',
                                    'Trusted responder network nearby',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-secondary-700 dark:text-secondary-300">
                                        <div className="w-6 h-6 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-secondary-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-20" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 rounded-full filter blur-3xl opacity-20" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to Join the Ride?
                    </h2>
                    <p className="text-xl text-secondary-300 mb-10 max-w-2xl mx-auto">
                        Connect with riders near you, challenge the best, and become part of the
                        Philippines' most exciting motorcycle community.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={route('register')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-secondary-900 font-semibold text-lg hover:bg-secondary-100 transition-all hover:scale-105"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            href={route('login')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all"
                        >
                            I Already Have an Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-secondary-950 border-t border-secondary-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                <MotorcycleIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-white">REV KONEK</span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-secondary-400">
                            <a href="#" className="hover:text-white transition-colors">About</a>
                            <a href="#" className="hover:text-white transition-colors">Features</a>
                            <a href="#" className="hover:text-white transition-colors">Safety</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>

                        <div className="text-sm text-secondary-500">
                            &copy; {new Date().getFullYear()} REV KONEK. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
