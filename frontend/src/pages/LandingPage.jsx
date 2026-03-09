import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Brain, Zap, Target, Award, ChevronRight, Star,
    MessageSquare, BarChart3, Shield, Mic, Code2, Users
} from 'lucide-react';

const features = [
    {
        icon: <Brain className="text-indigo-400" size={28} />,
        title: 'AI-Powered Questions',
        desc: 'Get dynamically generated questions tailored to your role, category, and difficulty level using GPT-4.',
        color: 'from-indigo-500/10 to-purple-500/10',
        border: 'border-indigo-500/20',
    },
    {
        icon: <Target className="text-cyan-400" size={28} />,
        title: 'Smart Answer Evaluation',
        desc: "AI evaluates your answers instantly, giving you scores, strengths, weaknesses, and improvement tips.",
        color: 'from-cyan-500/10 to-blue-500/10',
        border: 'border-cyan-500/20',
    },
    {
        icon: <Mic className="text-purple-400" size={28} />,
        title: 'Voice & Text Mode',
        desc: 'Answer via typing or voice recording. Practice just like a real interview scenario.',
        color: 'from-purple-500/10 to-pink-500/10',
        border: 'border-purple-500/20',
    },
    {
        icon: <BarChart3 className="text-green-400" size={28} />,
        title: 'Performance Analytics',
        desc: 'Track your progress over time with detailed charts showing score trends and skill breakdowns.',
        color: 'from-green-500/10 to-emerald-500/10',
        border: 'border-green-500/20',
    },
    {
        icon: <Code2 className="text-yellow-400" size={28} />,
        title: 'Multiple Roles & Topics',
        desc: 'Practice for Software Developer, Data Analyst, and more. Covers SQL, Coding, and HR rounds.',
        color: 'from-yellow-500/10 to-orange-500/10',
        border: 'border-yellow-500/20',
    },
    {
        icon: <Shield className="text-rose-400" size={28} />,
        title: 'Secure & Private',
        desc: 'Your interview data is encrypted and private. We use JWT authentication and secure storage.',
        color: 'from-rose-500/10 to-red-500/10',
        border: 'border-rose-500/20',
    },
];

const stats = [
    { value: '10K+', label: 'Practice Sessions' },
    { value: '95%', label: 'User Satisfaction' },
    { value: '50+', label: 'Question Categories' },
    { value: 'GPT-4', label: 'AI Powered' },
];

const steps = [
    { num: '01', title: 'Create Account', desc: 'Sign up for free in seconds. No credit card required.' },
    { num: '02', title: 'Setup Interview', desc: 'Choose your role, category, difficulty, and question count.' },
    { num: '03', title: 'Practice with AI', desc: 'Answer AI-generated questions in real interview conditions.' },
    { num: '04', title: 'Get Feedback', desc: 'Receive detailed scores, strengths, weaknesses, and tips.' },
];

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="hero-bg min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-6">
                {/* Animated background orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 shadow-sm fade-in-up">
                        <Zap size={14} className="fill-current" />
                        Powered by GPT-4 AI Technology
                        <Star size={12} className="fill-current" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Ace Your Next<br />
                        <span className="gradient-text">Interview</span> with AI
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Practice technical interviews with an intelligent AI interviewer. Get real-time feedback,
                        scoring, and personalized improvement suggestions to land your dream job.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to={user ? '/setup' : '/signup'}
                            className="btn-primary flex items-center gap-2 text-base md:text-lg px-8 py-4 w-full sm:w-auto justify-center"
                        >
                            <Brain size={20} />
                            Start Mock Interview
                            <ChevronRight size={18} />
                        </Link>
                        {!user && (
                            <Link to="/login" className="btn-secondary text-base md:text-lg px-8 py-4 w-full sm:w-auto justify-center">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Hero visual */}
                    <div className="mt-20 relative float-anim px-4">
                        <div className="glass-card p-4 sm:p-8 max-w-[90vw] md:max-w-2xl mx-auto border-indigo-500/20 shadow-2xl">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Brain size={18} className="text-white" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-[10px] text-indigo-600 font-bold mb-1 tracking-wider uppercase">AI INTERVIEWER</p>
                                    <div className="bg-indigo-50/50 rounded-2xl p-3 sm:p-4 border border-indigo-100 shadow-sm">
                                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                                            "Explain the difference between SQL INNER JOIN and LEFT JOIN. Can you provide a practical example where you would choose one over the other?"
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 flex-row-reverse">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Users size={18} className="text-white" />
                                </div>
                                <div className="flex-1 text-right min-w-0">
                                    <p className="text-[10px] text-emerald-600 font-bold mb-1 tracking-wider uppercase">YOUR ANSWER</p>
                                    <div className="bg-emerald-50/50 rounded-2xl p-3 sm:p-4 border border-emerald-100 text-left shadow-sm">
                                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                                            "INNER JOIN returns only matching rows from both tables, while LEFT JOIN returns all rows from the left table..."
                                        </p>
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className="score-badge score-high text-[10px] sm:text-xs">Score: 8.5/10</span>
                                            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold">✓ Excellent answer!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-6 border-y border-gray-100">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center p-6 bg-white border border-gray-50 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl md:text-5xl font-black gradient-text mb-2 tracking-tight">{stat.value}</div>
                            <div className="text-gray-500 font-bold uppercase text-xs tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20 px-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">Everything You Need to <span className="gradient-text">Succeed</span></h2>
                        <p className="text-gray-600 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                            A complete interview preparation platform with cutting-edge AI technology
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className={`glass-card p-7 border ${f.border} bg-gradient-to-br ${f.color} hover:scale-[1.02] transition-transform cursor-default`}
                            >
                                <div className="mb-4">{f.icon}</div>
                                <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">How It <span className="gradient-text">Works</span></h2>
                        <p className="text-gray-600 text-lg font-medium leading-relaxed">Get started in minutes with our simple process</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold gradient-text">{step.num}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 leading-tight">{step.title}</h3>
                                <p className="text-gray-600 text-sm font-medium leading-relaxed">{step.desc}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute right-0 top-8 text-gray-600">→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-white p-12 rounded-3xl border border-indigo-100 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 pulse-glow shadow-lg shadow-indigo-100">
                            <Award size={30} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">Ready to <span className="gradient-text">Level Up?</span></h2>
                        <p className="text-gray-600 text-lg mb-8 font-medium leading-relaxed">
                            Join thousands of developers who improved their interview skills with AI. Start your practice journey today!
                        </p>
                        <Link
                            to={user ? '/setup' : '/signup'}
                            className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4"
                        >
                            <Brain size={20} />
                            Start Free Practice
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 px-6 text-center text-gray-500 text-sm bg-white">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Brain size={20} className="text-indigo-600" />
                    <span className="font-bold text-gray-900 text-lg">InterviewAI</span>
                </div>
                <p className="mb-2">© 2024 InterviewAI Platform. Built with ❤️ and AI.</p>
                <div className="flex items-center justify-center gap-6 mt-4">
                    <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-600 transition">Terms of Service</a>
                    <a href="#" className="hover:text-indigo-600 transition">Contact Us</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
