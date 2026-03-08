import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    Brain, Code2, Users, Database, ChevronRight,
    Gauge, BookOpen, Zap, ArrowRight
} from 'lucide-react';

const roles = [
    { value: 'Software Developer', label: 'Software Developer', icon: '💻', desc: 'Algorithms, system design, coding' },
    { value: 'Data Analyst', label: 'Data Analyst', icon: '📊', desc: 'SQL, data modeling, analytics' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer', icon: '🌐', desc: 'Frontend, backend, APIs' },
    { value: 'Data Scientist', label: 'Data Scientist', icon: '🔬', desc: 'ML, statistics, Python' },
];

const categories = [
    { value: 'Coding', label: 'Coding', icon: <Code2 size={20} />, desc: 'DSA, algorithms, problem solving', color: 'border-purple-500/40 bg-purple-500/10' },
    { value: 'SQL', label: 'SQL', icon: <Database size={20} />, desc: 'Queries, joins, optimization', color: 'border-blue-500/40 bg-blue-500/10' },
    { value: 'HR', label: 'HR Round', icon: <Users size={20} />, desc: 'Behavioral, soft skills, situational', color: 'border-green-500/40 bg-green-500/10' },
];

const difficulties = [
    { value: 'beginner', label: 'Beginner', icon: <BookOpen size={18} />, desc: '0-1 year experience', color: 'border-teal-500/40 bg-teal-500/10 text-teal-400' },
    { value: 'intermediate', label: 'Intermediate', icon: <Gauge size={18} />, desc: '2-4 years experience', color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400' },
    { value: 'advanced', label: 'Advanced', icon: <Zap size={18} />, desc: '5+ years experience', color: 'border-red-500/40 bg-red-500/10 text-red-400' },
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

    return (
        <div className="hero-bg min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 fade-in-up">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 pulse-glow">
                        <Brain size={30} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">
                        Setup Your <span className="gradient-text">Interview</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Customize your practice session to match your target role and skill level
                    </p>
                </div>

                {/* Step 1: Role */}
                <div className="glass-card p-7 mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-sm font-bold">1</span>
                        Select Your Target Role
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {roles.map((role) => (
                            <button
                                key={role.value}
                                onClick={() => set('role_selected', role.value)}
                                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${form.role_selected === role.value
                                        ? 'border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                                        : 'border-white/10 bg-white/3 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{role.icon}</span>
                                    <div>
                                        <div className="font-semibold text-sm">{role.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{role.desc}</div>
                                    </div>
                                    {form.role_selected === role.value && (
                                        <div className="ml-auto w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                            <ChevronRight size={12} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Category */}
                <div className="glass-card p-7 mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center text-sm font-bold">2</span>
                        Choose Interview Category
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => set('category', cat.value)}
                                className={`p-5 rounded-xl border text-center transition-all hover:scale-[1.02] ${form.category === cat.value
                                        ? `${cat.color} border-opacity-100 shadow-lg`
                                        : 'border-white/10 bg-white/3 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${form.category === cat.value ? 'bg-white/10' : 'bg-white/5'
                                    }`}>
                                    {cat.icon}
                                </div>
                                <div className="font-semibold text-sm mb-1">{cat.label}</div>
                                <div className="text-xs text-gray-500">{cat.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Difficulty */}
                <div className="glass-card p-7 mb-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-sm font-bold">3</span>
                        Set Difficulty Level
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {difficulties.map((diff) => (
                            <button
                                key={diff.value}
                                onClick={() => set('difficulty', diff.value)}
                                className={`p-5 rounded-xl border text-center transition-all hover:scale-[1.02] ${form.difficulty === diff.value
                                        ? `${diff.color} border-opacity-100 shadow-lg`
                                        : 'border-white/10 bg-white/3 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center justify-center mb-3">{diff.icon}</div>
                                <div className="font-semibold text-sm mb-1">{diff.label}</div>
                                <div className="text-xs text-gray-500">{diff.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 4: Number of questions */}
                <div className="glass-card p-7 mb-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center text-sm font-bold">4</span>
                        Number of Questions: <span className="gradient-text ml-2">{form.num_questions}</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="3" max="10" step="1"
                            value={form.num_questions}
                            onChange={(e) => set('num_questions', parseInt(e.target.value))}
                            className="flex-1 h-2 appearance-none bg-white/10 rounded-full accent-indigo-500 cursor-pointer"
                        />
                        <div className="flex gap-2">
                            {[3, 5, 7, 10].map(n => (
                                <button
                                    key={n}
                                    onClick={() => set('num_questions', n)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${form.num_questions === n
                                            ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                                            : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
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
                        className="btn-primary text-lg px-12 py-5 inline-flex items-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                        <p className="text-gray-500 text-sm mt-3">Complete all selections above to begin</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewSetupPage;
