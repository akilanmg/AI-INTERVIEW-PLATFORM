import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, Legend, RadarChart,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { BarChart3, TrendingUp, Trophy, Target, Brain, Loader2, AlertCircle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3 border-indigo-500/30 text-sm">
                <p className="text-gray-400 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="font-semibold">
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
            <div className="hero-bg min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-indigo-400 mx-auto mb-4" />
                    <p className="text-gray-400">Loading your analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics || analytics.summary.totalInterviews === 0) {
        return (
            <div className="hero-bg min-h-screen flex items-center justify-center text-center px-6">
                <div>
                    <AlertCircle size={64} className="text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-3">No Data Yet</h2>
                    <p className="text-gray-400 mb-6">Complete some interviews to see your performance analytics.</p>
                    <a href="/setup" className="btn-primary inline-flex items-center gap-2">
                        <Brain size={18} /> Start Your First Interview
                    </a>
                </div>
            </div>
        );
    }

    const { summary, scoreTrend, categoryBreakdown, roleBreakdown, difficultyBreakdown } = analytics;

    return (
        <div className="hero-bg min-h-screen py-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 fade-in-up">
                    <h1 className="text-3xl font-bold mb-2">
                        Performance <span className="gradient-text">Analytics</span>
                    </h1>
                    <p className="text-gray-400">Track your interview performance trends and skill improvements</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {[
                        { icon: <Trophy size={22} className="text-yellow-400" />, label: 'Total Interviews', value: summary.totalInterviews, color: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20' },
                        { icon: <TrendingUp size={22} className="text-indigo-400" />, label: 'Average Score', value: `${summary.avgScore}/10`, color: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20' },
                        { icon: <Target size={22} className="text-green-400" />, label: 'Best Score', value: `${summary.bestScore}/10`, color: 'from-green-500/10 to-teal-500/10 border-green-500/20' },
                        { icon: <Brain size={22} className="text-cyan-400" />, label: 'Latest Score', value: `${summary.recentScore}/10`, color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20' },
                    ].map((stat, i) => (
                        <div key={i} className={`glass-card p-6 bg-gradient-to-br ${stat.color} fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Score Trend */}
                <div className="glass-card p-7 mb-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-400" />
                        Score Trend Over Time
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={scoreTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis domain={[0, 10]} stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="score"
                                name="Score"
                                stroke="#6366f1"
                                strokeWidth={3}
                                dot={{ fill: '#6366f1', strokeWidth: 2, r: 5 }}
                                activeDot={{ r: 8, fill: '#8b5cf6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Breakdowns */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* By Category */}
                    <div className="glass-card p-7 fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <BarChart3 size={20} className="text-purple-400" />
                            Score by Category
                        </h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={categoryBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis domain={[0, 10]} stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="avgScore" name="Avg Score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* By Difficulty */}
                    <div className="glass-card p-7 fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <Target size={20} className="text-cyan-400" />
                            Score by Difficulty
                        </h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={difficultyBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280', textTransform: 'capitalize' }} />
                                <YAxis domain={[0, 10]} stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="avgScore" name="Avg Score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* By Role */}
                {roleBreakdown.length > 0 && (
                    <div className="glass-card p-7 fade-in-up" style={{ animationDelay: '0.7s' }}>
                        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <Brain size={20} className="text-green-400" />
                            Score by Role
                        </h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={roleBreakdown} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" domain={[0, 10]} stroke="#6b7280" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis dataKey="name" type="category" width={160} stroke="#6b7280" tick={{ fontSize: 11, fill: '#6b7280' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="avgScore" name="Avg Score" fill="#10b981" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Improvement Suggestions based on scores */}
                <div className="glass-card p-7 mt-6 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        💡 Personalized Improvement Suggestions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {summary.avgScore < 7 && (
                            <div className="bg-yellow-500/8 rounded-xl p-4 border border-yellow-500/15">
                                <p className="text-yellow-400 font-semibold text-sm mb-1">📈 Boost Your Average</p>
                                <p className="text-gray-400 text-sm">Your avg score is {summary.avgScore}/10. Focus on structuring answers using STAR method and providing specific examples.</p>
                            </div>
                        )}
                        {categoryBreakdown.find(c => c.avgScore < 6) && (
                            <div className="bg-red-500/8 rounded-xl p-4 border border-red-500/15">
                                <p className="text-red-400 font-semibold text-sm mb-1">⚠️ Weak Category</p>
                                <p className="text-gray-400 text-sm">Your {categoryBreakdown.find(c => c.avgScore < 6)?.name} score is low. Dedicate more practice time to this area.</p>
                            </div>
                        )}
                        {summary.totalInterviews < 5 && (
                            <div className="bg-blue-500/8 rounded-xl p-4 border border-blue-500/15">
                                <p className="text-blue-400 font-semibold text-sm mb-1">🔄 Practice More</p>
                                <p className="text-gray-400 text-sm">You've completed {summary.totalInterviews} session(s). Aim for at least 10 sessions to see consistent improvement.</p>
                            </div>
                        )}
                        {summary.bestScore >= 8 && (
                            <div className="bg-green-500/8 rounded-xl p-4 border border-green-500/15">
                                <p className="text-green-400 font-semibold text-sm mb-1">🏆 Great Potential!</p>
                                <p className="text-gray-400 text-sm">You've scored {summary.bestScore}/10 at your best. Try to consistently perform at this level by reviewing feedback.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
