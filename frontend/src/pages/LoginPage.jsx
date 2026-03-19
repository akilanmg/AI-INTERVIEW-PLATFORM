import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Please fill in all fields');

        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back! 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero-bg min-h-screen min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            <div className="absolute top-16 left-[5%] w-40 h-40 sm:w-64 sm:h-64 bg-indigo-400/8 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-10 right-[5%] w-52 h-52 sm:w-80 sm:h-80 bg-purple-400/6 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" aria-hidden="true" />

            <div className="w-full max-w-md relative z-10 fade-in-up mx-auto">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 pulse-glow shadow-lg">
                        <Brain size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Welcome Back</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1 text-center">Sign in to continue your interview practice</p>
                </div>

                <div className="bg-white p-5 sm:p-7 md:p-8 rounded-2xl border border-gray-100 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    className="input-field pl-12"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    className="input-field pl-12 pr-12"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition p-1"
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base min-h-[48px] mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6 font-medium leading-relaxed">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold transition">
                            Create one for free →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
