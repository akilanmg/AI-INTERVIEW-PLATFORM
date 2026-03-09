import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    Brain, Plus, Clock, Trophy, Target, TrendingUp,
    Calendar, ChevronRight, Loader2, AlertCircle
} from 'lucide-react';

const categoryColors = {
    SQL: 'bg-blue-50 text-blue-600 border-blue-200',
    Coding: 'bg-purple-50 text-purple-600 border-purple-200',
    HR: 'bg-green-50 text-green-600 border-green-200',
};

const difficultyColors = {
    beginner: 'bg-teal-50 text-teal-600 border-teal-100',
    intermediate: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    advanced: 'bg-red-50 text-red-600 border-red-100',
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
        if (!score) return 'score-mid';
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
        <div className="hero-bg min-h-screen py-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div className="fade-in-up">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}! 👋</span>
                        </h1>
                        <p className="text-gray-600 mt-1 font-medium">Ready to practice? Your AI interviewer is waiting.</p>
                    </div>
                    <Link
                        to="/setup"
                        className="btn-primary flex items-center gap-2 fade-in-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <Plus size={18} />
                        New Interview
                    </Link>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-indigo-400" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                            {[
                                { icon: <Trophy size={22} className="text-orange-500" />, label: 'Total Interviews', value: stats?.totalInterviews || 0, color: 'from-orange-50 to-amber-50 border-orange-100' },
                                { icon: <Target size={22} className="text-emerald-500" />, label: 'Completed', value: stats?.completedInterviews || 0, color: 'from-emerald-50 to-teal-50 border-emerald-100' },
                                { icon: <TrendingUp size={22} className="text-indigo-500" />, label: 'Avg Score', value: stats?.averageScore ? `${stats.averageScore}/10` : 'N/A', color: 'from-indigo-50 to-violet-50 border-indigo-100' },
                                { icon: <Brain size={22} className="text-cyan-500" />, label: 'AI Sessions', value: sessions.length, color: 'from-cyan-50 to-sky-50 border-cyan-100' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className={`glass-card p-6 bg-gradient-to-br ${stat.color} fade-in-up`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</div>
                                    <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick actions */}
                        <div className="grid md:grid-cols-3 gap-5 mb-10">
                            {[
                                { to: '/setup', icon: <Brain size={24} className="text-indigo-600" />, title: 'Start New Interview', desc: 'Practice with AI now', bg: 'from-indigo-50 to-indigo-100/50 border-indigo-100' },
                                { to: '/analytics', icon: <TrendingUp size={24} className="text-emerald-600" />, title: 'View Analytics', desc: 'Track your progress', bg: 'from-emerald-50 to-emerald-100/50 border-emerald-100' },
                                { to: '/profile', icon: <Target size={24} className="text-cyan-600" />, title: 'Profile Settings', desc: 'Update your information', bg: 'from-cyan-50 to-cyan-100/50 border-cyan-100' },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.to}
                                    className={`glass-card p-6 bg-gradient-to-br ${item.bg} hover:scale-[1.02] transition-transform fade-in-up`}
                                    style={{ animationDelay: `${i * 0.1 + 0.4}s` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="mb-3">{item.icon}</div>
                                            <h3 className="font-semibold mb-1 text-gray-900">{item.title}</h3>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-500" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Interview History */}
                        <div className="glass-card fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock size={20} className="text-indigo-600" />
                                    Interview History
                                </h2>
                                <Link to="/analytics" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition">
                                    View Analytics →
                                </Link>
                            </div>

                            {sessions.length === 0 ? (
                                <div className="py-16 text-center">
                                    <AlertCircle size={48} className="text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-400 mb-2">No interviews yet</h3>
                                    <p className="text-gray-500 text-sm mb-6">Start your first AI mock interview to see results here</p>
                                    <Link to="/setup" className="btn-primary inline-flex items-center gap-2">
                                        <Plus size={16} /> Start First Interview
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {sessions.map((session, i) => (
                                        <div key={session.id} className="p-5 hover:bg-white/3 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Brain size={22} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className="font-semibold text-sm">{session.role_selected}</span>
                                                        <span className={`tag-pill border ${categoryColors[session.category] || 'bg-gray-500/20 text-gray-400'}`}>
                                                            {session.category}
                                                        </span>
                                                        <span className={`tag-pill ${difficultyColors[session.difficulty] || 'bg-gray-500/20 text-gray-400'}`}>
                                                            {session.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={11} />
                                                            {formatDate(session.created_at)}
                                                        </span>
                                                        <span>{session.num_questions} questions</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${session.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}>{session.status}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {session.overall_score != null && (
                                                    <span className={`score-badge ${getScoreClass(session.overall_score)}`}>
                                                        {session.overall_score}/10
                                                    </span>
                                                )}
                                                {session.status === 'completed' && (
                                                    <button
                                                        onClick={() => navigate(`/results/${session.id}`)}
                                                        className="btn-secondary text-xs py-2 px-4"
                                                    >
                                                        View Results
                                                    </button>
                                                )}
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
