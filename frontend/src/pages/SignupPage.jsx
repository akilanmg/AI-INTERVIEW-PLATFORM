import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const SignupPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        if (form.password !== form.confirm) return toast.error('Passwords do not match');

        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Account created! Welcome aboard 🚀');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const perks = ['AI-powered interview practice', 'Instant feedback & scoring', 'Performance analytics', '100% free to get started'];

    return (
        <div className="hero-bg min-h-screen min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            <div className="absolute top-16 left-[5%] w-40 h-40 sm:w-64 sm:h-64 bg-indigo-400/8 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-10 right-[5%] w-52 h-52 sm:w-80 sm:h-80 bg-purple-400/6 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" aria-hidden="true" />

            <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-center mx-auto">
                {/* Left - Info (Desktop only) */}
                <div className="hidden md:flex flex-col fade-in-up">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 pulse-glow shadow-lg shrink-0">
                        <Brain size={28} className="text-white" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 text-gray-900 leading-tight">
                        Start Your Interview <span className="gradient-text">Journey</span>
                    </h2>
                    <p className="text-gray-500 text-sm lg:text-base mb-6 lg:mb-8 leading-relaxed font-medium">
                        Join thousands of developers who are already practicing smarter with AI-powered mock interviews.
                    </p>
                    <ul className="space-y-3">
                        {perks.map((perk, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 font-semibold text-sm lg:text-base">
                                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={14} className="text-indigo-600" />
                                </div>
                                {perk}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right - Form */}
                <div className="fade-in-up w-full" style={{ animationDelay: '0.1s' }}>
                    <div className="text-center mb-6 md:hidden">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <Brain size={26} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Start your interview journey today</p>
                    </div>

                    <div className="bg-white p-5 sm:p-6 md:p-7 rounded-2xl border border-gray-100 shadow-xl">
                        <h3 className="text-lg font-bold mb-5 hidden md:block text-gray-900">Create your account</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="name" type="text"
                                        className="input-field pl-12"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="email" type="email"
                                        className="input-field pl-12"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="password" type={showPass ? 'text' : 'password'}
                                        className="input-field pl-12 pr-12"
                                        placeholder="Min. 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition p-1"
                                        aria-label={showPass ? 'Hide password' : 'Show password'}
                                    >
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {form.password && (
                                    <div className="mt-2.5">
                                        <div className="flex gap-1.5 h-1.5 mb-1.5 px-0.5">
                                            {[1, 2, 3, 4].map((level) => {
                                                const strength = (() => {
                                                    let s = 0;
                                                    if (form.password.length >= 6) s++;
                                                    if (/[A-Z]/.test(form.password)) s++;
                                                    if (/[0-9]/.test(form.password)) s++;
                                                    if (/[^A-Za-z0-9]/.test(form.password)) s++;
                                                    return s;
                                                })();
                                                const isActive = strength >= level;
                                                const color = strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-orange-400' : strength === 3 ? 'bg-yellow-400' : 'bg-emerald-400';
                                                return (
                                                    <div key={level} className={`flex-1 rounded-full transition-all duration-300 ${isActive ? color : 'bg-gray-100'}`} />
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            {(() => {
                                                const s = (() => {
                                                    let val = 0;
                                                    if (form.password.length >= 6) val++;
                                                    if (/[A-Z]/.test(form.password)) val++;
                                                    if (/[0-9]/.test(form.password)) val++;
                                                    if (/[^A-Za-z0-9]/.test(form.password)) val++;
                                                    return val;
                                                })();
                                                if (s === 1) return 'Weak';
                                                if (s === 2) return 'Fair';
                                                if (s === 3) return 'Good';
                                                if (s === 4) return 'Strong';
                                                return '';
                                            })()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="confirm" type="password"
                                        className="input-field pl-12"
                                        placeholder="Repeat your password"
                                        value={form.confirm}
                                        onChange={handleChange}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base min-h-[48px] mt-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-gray-500 text-sm mt-5 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition">
                                Sign in →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
