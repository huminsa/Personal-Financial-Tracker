import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Facebook, Twitter, Github } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex">
                    
                    {/* Left Side - Illustration */}
                    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
                        {/* Logo */}
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-white">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                                    <span className="text-2xl font-bold">P</span>
                                </div>
                                <span className="text-xl font-bold">PERSONAL</span>
                            </div>
                        </div>

                        {/* Illustration Area */}
                        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                            {/* Character Illustration Placeholder */}
                            <div className="relative">
                                <img 
                                    src="/images/login-illustration.svg" 
                                    alt="Login Illustration"
                                    className="w-80 h-80 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                {/* Fallback placeholder */}
                                <div className="hidden w-80 h-80 bg-white/10 backdrop-blur rounded-3xl items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-white text-sm">Place your illustration here<br/>login-illustration.svg</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="flex gap-4 mt-8">
                                {/* Card 1 */}
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs">New Project</span>
                                    </div>
                                    <div className="text-2xl font-bold">862</div>
                                    <div className="text-xs opacity-75">Active Project</div>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <span className="text-lg">💰</span>
                                        </div>
                                        <span className="text-xs">Total Profit</span>
                                    </div>
                                    <div className="text-2xl font-bold">$86.4k</div>
                                    <div className="text-xs text-green-300 flex items-center gap-1">
                                        <span>↗</span>
                                        <span>+15%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20">
                            <svg viewBox="0 0 200 200" className="text-white fill-current">
                                <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.7,56.4,53.6,69,40.1,76.4C26.6,83.7,11,86,0,86C-11,86,-22,83.7,-33.8,78.1C-45.6,72.5,-58.2,63.6,-67.3,51.3C-76.4,39,-82,23.3,-83.5,7.1C-85,-9.1,-82.4,-25.8,-75.4,-39.8C-68.4,-53.8,-57,-65.1,-43.6,-72.6C-30.2,-80.1,-15.1,-83.8,0.5,-84.6C16.1,-85.4,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            {/* Welcome Text */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    Welcome to PERSONAL! 👋
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Please sign-in to your account and start the adventure
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                    {status}
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={submit} className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="john@example.com"
                                        autoComplete="username"
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="············"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                            Remember Me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                                        >
                                            Forgot Password?
                                        </Link>
                                    )}
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Logging in...' : 'LOGIN'}
                                </button>

                                {/* Register Link */}
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    New on our platform?{' '}
                                    <Link
                                        href={route('register')}
                                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                                    >
                                        Create an account
                                    </Link>
                                </p>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">or</span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <Facebook className="w-5 h-5 text-blue-600" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <Twitter className="w-5 h-5 text-sky-500" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}