import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Trophy, Target, Brain, Loader2, AlertCircle, RotateCcw } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-4 py-3 border border-gray-100 text-sm shadow-xl rounded-xl">
                <p className="text-gray-500 mb-1 font-medium">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="font-bold">
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get('/analytics');
            setAnalytics(data.analytics);
        } catch (err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="hero-bg min-h-screen min-h-[100dvh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={44} className="animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading your analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics || analytics.summary.totalInterviews === 0) {
        return (
            <div className="hero-bg min-h-screen min-h-[100dvh] flex items-center justify-center text-center px-6">
                <div>
                    <AlertCircle size={56} className="text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">No Data Yet</h2>
                    <p className="text-gray-500 mb-6 font-medium text-sm sm:text-base">Complete some interviews to see your performance analytics.</p>
                    <a href="/setup" className="btn-primary inline-flex items-center gap-2">
                        <Brain size={18} /> Start Your First Interview
                    </a>
                </div>
            </div>
        );
    }

    const { summary, scoreTrend, categoryBreakdown, roleBreakdown, difficultyBreakdown } = analytics;

    return (
        <div className="hero-bg min-h-screen min-h-[100dvh] py-5 sm:py-8 md:py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-5 sm:mb-8 md:mb-10 fade-in-up">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 text-gray-900">
                        Performance <span className="gradient-text">Analytics</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">Track your interview performance trends and skill improvements</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-5 sm:mb-8 md:mb-10">
                    {[
                        { icon: <Trophy size={20} className="text-orange-500" />, label: 'Total Interviews', value: summary.totalInterviews, color: 'from-orange-50 to-amber-50 border-orange-100' },
                        { icon: <TrendingUp size={20} className="text-indigo-600" />, label: 'Average Score', value: `${summary.avgScore}/10`, color: 'from-indigo-50 to-purple-50 border-indigo-100' },
                        { icon: <Target size={20} className="text-emerald-600" />, label: 'Best Score', value: `${summary.bestScore}/10`, color: 'from-emerald-50 to-teal-50 border-emerald-100' },
                        { icon: <Brain size={20} className="text-cyan-600" />, label: 'Latest Score', value: `${summary.recentScore}/10`, color: 'from-cyan-50 to-sky-50 border-cyan-100' },
                    ].map((stat, i) => (
                        <div key={i} className={`glass-card p-3.5 sm:p-4 md:p-6 bg-gradient-to-br ${stat.color} fade-in-up`} style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-2.5 sm:mb-3">
                                {stat.icon}
                            </div>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 text-gray-900">{stat.value}</div>
                            <div className="text-gray-500 text-[10px] sm:text-xs font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Score Trend */}
                <div className="bg-white p-4 sm:p-5 md:p-7 mb-4 sm:mb-6 border border-gray-100 shadow-lg rounded-2xl fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-900">
                        <TrendingUp size={18} className="text-indigo-600" />
                        Score Trend Over Time
                    </h2>
                    <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] -ml-2 sm:ml-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scoreTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    name="Score"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 7, fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6">
                    {/* By Category */}
                    <div className="bg-white p-4 sm:p-5 md:p-7 border border-gray-100 shadow-lg rounded-2xl fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <BarChart3 size={18} className="text-purple-600" />
                            Score by Category
                        </h2>
                        <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] -ml-2 sm:ml-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryBreakdown} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="avgScore" name="Avg Score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* By Difficulty */}
                    <div className="bg-white p-4 sm:p-5 md:p-7 border border-gray-100 shadow-lg rounded-2xl fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <h2 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <Target size={18} className="text-cyan-600" />
                            Score by Difficulty
                        </h2>
                        <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] -ml-2 sm:ml-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={difficultyBreakdown} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="avgScore" name="Avg Score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* By Role */}
                {roleBreakdown.length > 0 && (
                    <div className="bg-white p-4 sm:p-5 md:p-7 border border-gray-100 shadow-lg rounded-2xl fade-in-up mb-4 sm:mb-6" style={{ animationDelay: '0.6s' }}>
                        <h2 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <Brain size={18} className="text-emerald-600" />
                            Score by Role
                        </h2>
                        <div className="w-full h-[160px] sm:h-[180px] md:h-[200px] -ml-2 sm:ml-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={roleBreakdown} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="avgScore" name="Avg Score" fill="#10b981" radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Improvement Suggestions */}
                <div className="bg-white p-4 sm:p-5 md:p-7 border border-indigo-100 shadow-lg rounded-2xl fade-in-up" style={{ animationDelay: '0.7s' }}>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-900 flex-wrap">
                        💡 <span className="gradient-text">Improvement Suggestions</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {summary.avgScore < 7 && (
                            <div className="bg-amber-50 rounded-xl p-4 sm:p-5 border border-amber-100">
                                <p className="text-amber-700 font-bold text-xs sm:text-sm mb-1.5 flex items-center gap-2">
                                    <TrendingUp size={14} /> Boost Your Average
                                </p>
                                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">Your avg score is {summary.avgScore}/10. Focus on structuring answers using STAR method and providing specific examples.</p>
                            </div>
                        )}
                        {categoryBreakdown.find(c => c.avgScore < 6) && (
                            <div className="bg-red-50 rounded-xl p-4 sm:p-5 border border-red-100">
                                <p className="text-red-700 font-bold text-xs sm:text-sm mb-1.5 flex items-center gap-2">
                                    <AlertCircle size={14} /> Weak Category
                                </p>
                                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">Your {categoryBreakdown.find(c => c.avgScore < 6)?.name} score is low. Dedicate more practice time to this area.</p>
                            </div>
                        )}
                        {summary.totalInterviews < 5 && (
                            <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                                <p className="text-blue-700 font-bold text-xs sm:text-sm mb-1.5 flex items-center gap-2">
                                    <RotateCcw size={14} /> Practice More
                                </p>
                                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">You've completed {summary.totalInterviews} session(s). Aim for at least 10 sessions to see consistent improvement.</p>
                            </div>
                        )}
                        {summary.bestScore >= 8 && (
                            <div className="bg-emerald-50 rounded-xl p-4 sm:p-5 border border-emerald-100">
                                <p className="text-emerald-700 font-bold text-xs sm:text-sm mb-1.5 flex items-center gap-2">
                                    <Trophy size={14} /> Great Potential!
                                </p>
                                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">You've scored {summary.bestScore}/10 at your best. Try to consistently perform at this level by reviewing feedback.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
