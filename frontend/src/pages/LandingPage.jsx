import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Brain, Zap, Target, Award, ChevronRight, Star,
    MessageSquare, BarChart3, Shield, Mic, Code2, Users,
    ArrowRight, Sparkles, Play
} from 'lucide-react';

const features = [
    {
        icon: <Brain className="text-indigo-500" size={26} />,
        title: 'AI-Powered Questions',
        desc: 'Dynamically generated questions tailored to your role, category, and difficulty using GPT-4.',
        color: 'from-indigo-50 to-purple-50',
        border: 'border-indigo-100',
        iconBg: 'bg-indigo-50',
    },
    {
        icon: <Target className="text-cyan-500" size={26} />,
        title: 'Smart Evaluation',
        desc: "AI evaluates your answers instantly with scores, strengths, weaknesses, and improvement tips.",
        color: 'from-cyan-50 to-blue-50',
        border: 'border-cyan-100',
        iconBg: 'bg-cyan-50',
    },
    {
        icon: <Mic className="text-purple-500" size={26} />,
        title: 'Voice & Text Mode',
        desc: 'Answer via typing or voice recording — practice just like a real interview scenario.',
        color: 'from-purple-50 to-pink-50',
        border: 'border-purple-100',
        iconBg: 'bg-purple-50',
    },
    {
        icon: <BarChart3 className="text-emerald-500" size={26} />,
        title: 'Performance Analytics',
        desc: 'Track progress with detailed charts showing score trends and skill breakdowns.',
        color: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-100',
        iconBg: 'bg-emerald-50',
    },
    {
        icon: <Code2 className="text-amber-500" size={26} />,
        title: 'Multiple Roles & Topics',
        desc: 'Practice for Software Developer, Data Analyst, and more — SQL, Coding, HR rounds.',
        color: 'from-amber-50 to-orange-50',
        border: 'border-amber-100',
        iconBg: 'bg-amber-50',
    },
    {
        icon: <Shield className="text-rose-500" size={26} />,
        title: 'Secure & Private',
        desc: 'Your interview data is encrypted and private with JWT authentication and secure storage.',
        color: 'from-rose-50 to-red-50',
        border: 'border-rose-100',
        iconBg: 'bg-rose-50',
    },
];

const stats = [
    { value: '10K+', label: 'Practice Sessions', icon: <Play size={16} className="text-indigo-400" /> },
    { value: '95%', label: 'Satisfaction Rate', icon: <Star size={16} className="text-amber-400" /> },
    { value: '50+', label: 'Question Categories', icon: <Code2 size={16} className="text-purple-400" /> },
    { value: 'GPT-4', label: 'AI Powered', icon: <Sparkles size={16} className="text-cyan-400" /> },
];

const steps = [
    { num: '01', title: 'Create Account', desc: 'Sign up for free in seconds. No credit card required.', color: 'from-indigo-500 to-purple-500' },
    { num: '02', title: 'Setup Interview', desc: 'Choose your role, category, difficulty, and question count.', color: 'from-purple-500 to-pink-500' },
    { num: '03', title: 'Practice with AI', desc: 'Answer AI-generated questions in real interview conditions.', color: 'from-pink-500 to-rose-500' },
    { num: '04', title: 'Get Feedback', desc: 'Receive detailed scores, strengths, weaknesses, and tips.', color: 'from-emerald-500 to-teal-500' },
];

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="hero-bg min-h-screen">
            {/* ======== HERO SECTION ======== */}
            <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32 px-4 sm:px-6">
                {/* Background orbs */}
                <div className="absolute top-16 left-[5%] w-40 h-40 sm:w-72 sm:h-72 bg-indigo-400/8 rounded-full blur-[60px] sm:blur-[80px] animate-pulse pointer-events-none" aria-hidden="true" />
                <div className="absolute bottom-8 right-[5%] w-52 h-52 sm:w-80 sm:h-80 bg-purple-400/6 rounded-full blur-[70px] sm:blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} aria-hidden="true" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/4 rounded-full blur-[120px] pointer-events-none hidden lg:block" aria-hidden="true" />

                <div className="container-custom text-center relative z-10 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-white/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-sm fade-in-up backdrop-blur-sm">
                        <Zap size={14} className="fill-current" />
                        Powered by GPT-4 AI Technology
                        <Star size={12} className="fill-current hidden sm:block text-amber-400" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-5 sm:mb-6 fade-in-up tracking-tight" style={{ animationDelay: '0.1s' }}>
                        Ace Your Next<br className="hidden sm:block" />
                        <span className="gradient-text"> Interview </span>with AI
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed fade-in-up px-2 sm:px-0" style={{ animationDelay: '0.2s' }}>
                        Practice technical interviews with an intelligent AI interviewer. Get real-time feedback,
                        scoring, and personalized improvement suggestions to land your dream job.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 fade-in-up max-w-md sm:max-w-none mx-auto" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to={user ? '/setup' : '/signup'}
                            className="btn-primary flex items-center justify-center gap-2 text-base px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto min-h-[48px]"
                        >
                            <Brain size={20} />
                            Start Mock Interview
                            <ChevronRight size={18} />
                        </Link>
                        {!user && (
                            <Link to="/login" className="btn-secondary flex items-center justify-center text-base px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto min-h-[48px]">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Hero Visual - Interview Demo */}
                    <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 relative float-anim">
                        <div className="glass-card p-4 sm:p-6 md:p-8 max-w-full md:max-w-3xl mx-auto border border-indigo-100/40 shadow-xl shadow-indigo-100/20 relative overflow-hidden">
                            {/* Top gradient line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                            
                            {/* Decorative corners */}
                            <div className="absolute -top-3 -left-3 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur rounded-xl border border-indigo-50 flex items-center justify-center shadow-lg hidden sm:flex">
                                <Code2 size={20} className="text-indigo-500" />
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur rounded-xl border border-emerald-50 flex items-center justify-center shadow-lg hidden sm:flex">
                                <Award size={20} className="text-emerald-500" />
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                {/* AI Question */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Brain size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] sm:text-xs text-indigo-600 font-bold mb-1.5 tracking-wider uppercase">AI INTERVIEWER</p>
                                        <div className="bg-indigo-50/60 rounded-2xl rounded-tl-md p-3 sm:p-4 border border-indigo-100/60">
                                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                                                "Explain how React's Virtual DOM improves performance compared to direct DOM manipulation."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* User Answer */}
                                <div className="flex items-start gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Users size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <div className="flex-1 text-right min-w-0">
                                        <p className="text-[10px] sm:text-xs text-emerald-600 font-bold mb-1.5 tracking-wider uppercase">YOUR ANSWER</p>
                                        <div className="bg-emerald-50/60 rounded-2xl rounded-tr-md p-3 sm:p-4 border border-emerald-100/60 text-left">
                                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                                                "React uses a diffing algorithm to compare the new virtual tree with the old one, and only updates the actual DOM where necessary..."
                                            </p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="score-badge score-high text-[10px] sm:text-xs px-2.5 py-0.5">Score: 9.0/10</span>
                                                <span className="text-[10px] sm:text-xs text-emerald-600 font-bold">✓ Great explanation!</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== STATS ======== */}
            <section className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 bg-white/50 backdrop-blur-sm border-y border-gray-100/80">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 max-w-5xl mx-auto">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[90px] sm:min-h-[110px] group">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                                <div className="text-xl sm:text-3xl md:text-4xl font-black gradient-text mb-1 tracking-tight">{stat.value}</div>
                                <div className="text-gray-500 font-semibold text-[10px] sm:text-xs tracking-wide uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== FEATURES ======== */}
            <section className="py-14 sm:py-18 md:py-24 px-4 sm:px-6">
                <div className="container-custom max-w-6xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 leading-tight">
                            Everything You Need to <span className="gradient-text">Succeed</span>
                        </h2>
                        <p className="text-gray-500 font-medium text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                            A complete interview preparation platform with cutting-edge AI technology.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className={`p-5 sm:p-6 md:p-7 border ${f.border} rounded-2xl bg-gradient-to-br ${f.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default flex flex-col group`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${f.iconBg} shadow-sm flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800 leading-snug">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed flex-1">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== HOW IT WORKS ======== */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white/30">
                <div className="container-custom max-w-5xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 leading-tight">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                            Get started in minutes with our simple process
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="text-center relative flex flex-col items-center group">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                                    <span className="text-xl sm:text-2xl font-bold text-white">{step.num}</span>
                                </div>
                                <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-1.5 leading-snug">{step.title}</h3>
                                <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm font-medium leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== CTA ======== */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
                <div className="container-custom max-w-2xl mx-auto text-center">
                    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-glow shadow-lg">
                            <Award size={26} className="text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 leading-tight">
                            Ready to <span className="gradient-text">Level Up?</span>
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 font-medium leading-relaxed max-w-md mx-auto">
                            Join thousands of developers who improved their interview skills with AI. Start your practice journey today!
                        </p>
                        <Link
                            to={user ? '/setup' : '/signup'}
                            className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-3.5 sm:py-4 w-full sm:w-auto min-h-[48px]"
                        >
                            <Brain size={20} />
                            Start Free Practice
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ======== FOOTER ======== */}
            <footer className="border-t border-gray-100 py-8 sm:py-10 px-4 sm:px-6 bg-white">
                <div className="container-custom">
                    <div className="flex flex-col items-center justify-center gap-4 max-w-4xl mx-auto">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Brain size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-gray-900 text-lg">InterviewAI</span>
                        </div>
                        <p className="text-gray-400 text-sm">© 2025 InterviewAI Platform. Built with ❤️ and AI.</p>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition font-medium">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition font-medium">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition font-medium">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
