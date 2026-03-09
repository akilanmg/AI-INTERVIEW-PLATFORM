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
        <div className="hero-bg min-h-screen flex items-center justify-center px-6 py-12">
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/8 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-4xl relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left - Info */}
                <div className="hidden md:block fade-in-up">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 pulse-glow shadow-lg shadow-indigo-100">
                        <Brain size={30} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">
                        Start Your Interview <span className="gradient-text">Journey</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">
                        Join thousands of developers who are already practicing smarter with AI-powered mock interviews.
                    </p>
                    <ul className="space-y-4">
                        {perks.map((perk, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                                <CheckCircle size={18} className="text-indigo-600 flex-shrink-0" />
                                {perk}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right - Form */}
                <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="text-center mb-6 md:hidden">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                            <Brain size={26} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Create Account</h1>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-indigo-100 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 hidden md:block text-gray-900">Create your account</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="name" type="text"
                                        className="input-field pl-12"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="email" type="email"
                                        className="input-field pl-12"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="password" type={showPass ? 'text' : 'password'}
                                        className="input-field pl-12 pr-12"
                                        placeholder="Min. 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition">
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="confirm" type="password"
                                        className="input-field pl-12"
                                        placeholder="Repeat your password"
                                        value={form.confirm}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
