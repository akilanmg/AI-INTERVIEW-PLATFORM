import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    Brain, Code2, Users, Database, ChevronRight,
    Gauge, BookOpen, Zap, ArrowRight, CheckCircle
} from 'lucide-react';

const roles = [
    { value: 'Software Developer', label: 'Software Developer', icon: '💻', desc: 'Algorithms, system design, coding' },
    { value: 'Data Analyst', label: 'Data Analyst', icon: '📊', desc: 'SQL, data modeling, analytics' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer', icon: '🌐', desc: 'Frontend, backend, APIs' },
    { value: 'Data Scientist', label: 'Data Scientist', icon: '🔬', desc: 'ML, statistics, Python' },
];

const categories = [
    { value: 'Coding', label: 'Coding', icon: <Code2 size={20} />, desc: 'DSA, algorithms, problem solving', color: 'border-purple-200 bg-purple-50 text-purple-600' },
    { value: 'SQL', label: 'SQL', icon: <Database size={20} />, desc: 'Queries, joins, optimization', color: 'border-blue-200 bg-blue-50 text-blue-600' },
    { value: 'HR', label: 'HR Round', icon: <Users size={20} />, desc: 'Behavioral, soft skills, situational', color: 'border-green-200 bg-green-50 text-green-600' },
];

const difficulties = [
    { value: 'beginner', label: 'Beginner', icon: <BookOpen size={18} />, desc: '0-1 year experience', color: 'border-teal-200 bg-teal-50 text-teal-600' },
    { value: 'intermediate', label: 'Intermediate', icon: <Gauge size={18} />, desc: '2-4 years experience', color: 'border-yellow-200 bg-yellow-50 text-yellow-600' },
    { value: 'advanced', label: 'Advanced', icon: <Zap size={18} />, desc: '5+ years experience', color: 'border-red-200 bg-red-50 text-red-600' },
];

const InterviewSetupPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        role_selected: '',
        category: '',
        difficulty: '',
        num_questions: 5,
    });
    const [loading, setLoading] = useState(false);

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleStart = async () => {
        if (!form.role_selected || !form.category || !form.difficulty) {
            return toast.error('Please complete all selections');
        }
        setLoading(true);
        try {
            const { data } = await api.post('/interview/session', form);
            toast.success('Interview session created!');
            navigate(`/interview/${data.session.id}`, {
                state: {
                    session: data.session,
                    role_selected: form.role_selected,
                    category: form.category,
                    difficulty: form.difficulty,
                    num_questions: form.num_questions,
                },
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    const isComplete = form.role_selected && form.category && form.difficulty;
    const completedSteps = [form.role_selected, form.category, form.difficulty].filter(Boolean).length;

    return (
        <div className="hero-bg min-h-screen min-h-[100dvh] py-5 sm:py-8 md:py-10 px-4 sm:px-6">
            <div className="container-custom max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10 fade-in-up">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 pulse-glow shadow-lg">
                        <Brain size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 leading-tight">
                        Setup Your <span className="gradient-text">Interview</span>
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base font-medium px-4">
                        Customize your practice session to match your target role
                    </p>
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${
                                completedSteps >= step ? 'w-10 bg-indigo-500' : 'w-6 bg-gray-200'
                            }`} />
                        ))}
                    </div>
                </div>

                {/* Step 1: Role */}
                <div className="glass-card p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2.5 text-gray-900">
                        <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">1</span>
                        Target Role
                        {form.role_selected && <CheckCircle size={16} className="text-emerald-500 ml-auto" />}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {roles.map((role) => (
                            <button
                                key={role.value}
                                onClick={() => set('role_selected', role.value)}
                                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 group min-h-[60px] ${form.role_selected === role.value
                                    ? 'border-indigo-400 bg-indigo-50/60 shadow-md ring-2 ring-indigo-400/30'
                                    : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/20'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white shadow-sm border border-gray-50 shrink-0 ${form.role_selected === role.value ? 'border-indigo-100 bg-indigo-50' : ''}`}>
                                        {role.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm ${form.role_selected === role.value ? 'text-indigo-900' : 'text-gray-900'}`}>{role.label}</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500 truncate">{role.desc}</div>
                                    </div>
                                    {form.role_selected === role.value && (
                                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm shrink-0">
                                            <ChevronRight size={12} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Category */}
                <div className="glass-card p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2.5 text-gray-900">
                        <span className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center text-xs font-black">2</span>
                        Interview Category
                        {form.category && <CheckCircle size={16} className="text-emerald-500 ml-auto" />}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => set('category', cat.value)}
                                className={`p-3.5 sm:p-4 md:p-5 rounded-xl border text-left sm:text-center transition-all duration-200 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 min-h-[56px] ${form.category === cat.value
                                    ? `${cat.color} ring-2 ring-current/30 shadow-md`
                                    : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/20'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-0 sm:mb-3 shadow-sm shrink-0 ${form.category === cat.value ? 'bg-white/60' : 'bg-gray-50'
                                    }`}>
                                    {cat.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-900 mb-0 sm:mb-1">{cat.label}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{cat.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Difficulty */}
                <div className="glass-card p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2.5 text-gray-900">
                        <span className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center text-xs font-black">3</span>
                        Difficulty Level
                        {form.difficulty && <CheckCircle size={16} className="text-emerald-500 ml-auto" />}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {difficulties.map((diff) => (
                            <button
                                key={diff.value}
                                onClick={() => set('difficulty', diff.value)}
                                className={`p-3.5 sm:p-4 md:p-5 rounded-xl border text-left sm:text-center transition-all duration-200 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 min-h-[56px] ${form.difficulty === diff.value
                                    ? `${diff.color} ring-2 ring-current/30 shadow-md`
                                    : 'border-gray-100 bg-white hover:border-cyan-200 hover:bg-cyan-50/20'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-0 sm:mb-3 shadow-sm shrink-0 ${form.difficulty === diff.value ? 'bg-white/60' : 'bg-gray-50'
                                    }`}>
                                    {diff.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-900 mb-0 sm:mb-1 capitalize">{diff.label}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{diff.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 4: Number of questions */}
                <div className="glass-card p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-sm sm:text-base font-bold mb-4 flex flex-wrap items-center gap-2 text-gray-900">
                        <span className="w-7 h-7 rounded-lg bg-green-50 border border-green-200 text-green-600 flex items-center justify-center text-xs font-bold">4</span>
                        Questions: <span className="gradient-text text-lg font-black">{form.num_questions}</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <input
                            type="range"
                            min="3" max="10" step="1"
                            value={form.num_questions}
                            onChange={(e) => set('num_questions', parseInt(e.target.value))}
                            className="flex-1 min-w-0 cursor-pointer"
                        />
                        <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                            {[3, 5, 7, 10].map(n => (
                                <button
                                    key={n}
                                    onClick={() => set('num_questions', n)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all min-w-[40px] ${form.num_questions === n
                                        ? 'bg-indigo-100 border border-indigo-300 text-indigo-700 shadow-sm'
                                        : 'bg-gray-50 border border-gray-200 text-gray-500 hover:border-indigo-200 hover:text-indigo-600'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Start button */}
                <div className="text-center fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <button
                        onClick={handleStart}
                        disabled={!isComplete || loading}
                        className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px]"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating session...
                            </>
                        ) : (
                            <>
                                <Brain size={22} />
                                Start Interview
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    {!isComplete && (
                        <p className="text-gray-400 text-sm mt-3 font-medium">Complete all {3 - completedSteps} remaining selection{3 - completedSteps > 1 ? 's' : ''} above</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewSetupPage;
