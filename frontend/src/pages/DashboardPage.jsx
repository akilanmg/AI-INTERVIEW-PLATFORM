import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    Brain, Plus, Clock, Trophy, Target, TrendingUp,
    Calendar, ChevronRight, Loader2, AlertCircle, Sparkles
} from 'lucide-react';

const categoryColors = {
    SQL: 'bg-blue-50 text-blue-600 border-blue-200',
    Coding: 'bg-purple-50 text-purple-600 border-purple-200',
    HR: 'bg-green-50 text-green-600 border-green-200',
};

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [historyRes, profileRes] = await Promise.all([
                api.get('/interview/history'),
                api.get('/user/profile'),
            ]);
            setSessions(historyRes.data.sessions || []);
            setStats(profileRes.data.stats);
        } catch (err) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getScoreClass = (score) => {
        if (score == null) return 'score-mid';
        if (score >= 7) return 'score-high';
        if (score >= 5) return 'score-mid';
        return 'score-low';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="hero-bg min-h-screen min-h-[100dvh] py-5 sm:py-8 md:py-10 px-4 sm:px-6">
            <div className="container-custom max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
                    <div className="fade-in-up min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight truncate">
                            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}! 👋</span>
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium text-sm">Ready to practice? Your AI interviewer is waiting.</p>
                    </div>
                    <Link
                        to="/setup"
                        className="btn-primary flex items-center justify-center gap-2 fade-in-up w-full sm:w-auto min-h-[48px] py-3 px-5 sm:px-6"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <Plus size={18} />
                        New Interview
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-indigo-400" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
                            {[
                                { icon: <Trophy size={18} className="text-orange-500" />, label: 'Interviews', value: stats?.totalInterviews || 0, color: 'bg-orange-50/50 border-orange-100' },
                                { icon: <Target size={18} className="text-emerald-500" />, label: 'Completed', value: stats?.completedInterviews || 0, color: 'bg-emerald-50/50 border-emerald-100' },
                                { icon: <TrendingUp size={18} className="text-indigo-500" />, label: 'Avg Score', value: stats?.averageScore ? `${stats.averageScore}/10` : '—', color: 'bg-indigo-50/50 border-indigo-100' },
                                { icon: <Brain size={18} className="text-cyan-500" />, label: 'AI Sessions', value: sessions.length, color: 'bg-cyan-50/50 border-cyan-100' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className={`bg-white p-4 sm:p-5 md:p-6 rounded-2xl border ${stat.color} shadow-sm fade-in-up hover:shadow-md transition-all duration-300`}
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 text-gray-900 tracking-tight">{stat.value}</div>
                                    <div className="text-gray-500 text-[10px] sm:text-xs font-semibold tracking-wide uppercase">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
                            {[
                                { to: '/setup', icon: <Brain size={22} className="text-indigo-600" />, title: 'Start New Interview', desc: 'Practice with AI now', bg: 'bg-white border-indigo-100 hover:border-indigo-200' },
                                { to: '/analytics', icon: <TrendingUp size={22} className="text-emerald-600" />, title: 'View Analytics', desc: 'Track your progress', bg: 'bg-white border-emerald-100 hover:border-emerald-200' },
                                { to: '/profile', icon: <Target size={22} className="text-cyan-600" />, title: 'Profile Settings', desc: 'Update details', bg: 'bg-white border-cyan-100 hover:border-cyan-200' },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.to}
                                    className={`p-4 sm:p-5 md:p-6 rounded-2xl border-2 ${item.bg} shadow-sm hover:shadow-lg transition-all duration-300 fade-in-up flex items-center justify-between gap-3 group`}
                                    style={{ animationDelay: `${i * 0.08 + 0.3}s` }}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-2.5 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">{item.title}</h3>
                                        <p className="text-gray-500 text-xs font-medium mt-0.5">{item.desc}</p>
                                    </div>
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                        <ChevronRight size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* History */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-sm sm:text-base md:text-lg font-bold flex items-center gap-2 text-gray-900">
                                    <Clock size={18} className="text-indigo-600" />
                                    Recent Activity
                                </h2>
                                <Link to="/analytics" className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm font-bold transition">
                                    See all →
                                </Link>
                            </div>

                            {sessions.length === 0 ? (
                                <div className="py-12 sm:py-16 text-center px-6">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle size={28} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">No interviews yet</h3>
                                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Start your first AI mock interview to see results here</p>
                                    <Link to="/setup" className="btn-primary inline-flex items-center gap-2">
                                        <Sparkles size={16} /> Start Now
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50/50 transition flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                    <Brain size={18} className="text-indigo-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                        <span className="font-bold text-sm text-gray-900 truncate">{session.role_selected || 'Interview'}</span>
                                                        <span className={`tag-pill px-2 py-0.5 text-[9px] sm:text-[10px] font-bold ${categoryColors[session.category] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                            {session.category}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5 text-[10px] sm:text-xs text-gray-400 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={11} />
                                                            {formatDate(session.created_at)}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter text-[9px] sm:text-[10px] ${session.status === 'completed' ? 'text-emerald-500 bg-emerald-50' : 'text-orange-500 bg-orange-50'}`}>
                                                            {session.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50 sm:flex-shrink-0">
                                                {session.overall_score != null && (
                                                    <div className={`score-badge ${getScoreClass(session.overall_score)} px-3 py-1 text-xs font-black min-w-[45px] text-center`}>
                                                        {session.overall_score}/10
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    {session.status !== 'completed' ? (
                                                        <button
                                                            onClick={() => navigate(`/interview/${session.id}`, {
                                                                state: {
                                                                    role_selected: session.role_selected,
                                                                    category: session.category,
                                                                    difficulty: session.difficulty,
                                                                    num_questions: session.num_questions
                                                                }
                                                            })}
                                                            className="btn-primary py-1.5 px-3 sm:px-4 text-[10px] sm:text-xs min-h-0"
                                                        >
                                                            Resume
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => navigate(`/results/${session.id}`)}
                                                            className="btn-secondary py-1.5 px-3 sm:px-4 text-[10px] sm:text-xs min-h-0"
                                                        >
                                                            View Result
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
