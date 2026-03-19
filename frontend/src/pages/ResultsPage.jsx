import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    Trophy, Brain, CheckCircle, AlertCircle, TrendingUp,
    RotateCcw, BarChart3, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';

const ScoreRing = ({ score }) => {
    const pct = (score / 10) * 100;
    const r = 54;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;

    const color = score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="10" />
                <circle
                    cx="60" cy="60" r={r} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.5s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold" style={{ color }}>{score}</span>
                <span className="text-xs text-gray-400 font-bold">/ 10</span>
            </div>
        </div>
    );
};

const ResultsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        fetchResults();
    }, [id]);

    const fetchResults = async () => {
        try {
            const { data } = await api.get(`/interview/session/${id}/results`);
            setSession(data.session);
            setQuestions(data.questions);
        } catch (err) {
            toast.error('Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (qId) => setExpanded(prev => ({ ...prev, [qId]: !prev[qId] }));

    if (loading) {
        return (
            <div className="hero-bg min-h-screen min-h-[100dvh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={44} className="animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="hero-bg min-h-screen min-h-[100dvh] flex items-center justify-center text-center px-6">
                <div>
                    <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Results Not Found</h2>
                    <Link to="/dashboard" className="btn-primary inline-flex mt-4">Go to Dashboard</Link>
                </div>
            </div>
        );
    }

    const score = session.overall_score || 0;
    const scoreLabel = score >= 8 ? '🏆 Excellent!' : score >= 6 ? '👍 Good job!' : score >= 4 ? '📈 Keep practicing!' : '💪 Needs improvement';
    const answeredCount = questions.filter(q => q.answers?.length > 0).length;

    return (
        <div className="hero-bg min-h-screen min-h-[100dvh] py-5 sm:py-8 md:py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Overall Score Card */}
                <div className="bg-white p-5 sm:p-7 md:p-10 mb-5 sm:mb-8 text-center border border-indigo-100 shadow-xl fade-in-up rounded-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Trophy size={24} className="text-white" />
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900">Interview Complete!</h1>
                    <p className="text-gray-500 font-medium mb-6 sm:mb-8 text-sm sm:text-base">{scoreLabel}</p>

                    <ScoreRing score={score} />

                    <p className="text-gray-400 text-xs sm:text-sm mt-5 mb-5 font-medium">Overall Score</p>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-2">
                        <div className="text-center p-2 sm:p-3 rounded-xl bg-gray-50">
                            <div className="text-lg sm:text-2xl font-bold text-indigo-500">{questions.length}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">Questions</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-xl bg-gray-50">
                            <div className="text-lg sm:text-2xl font-bold text-green-500">{answeredCount}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">Answered</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-xl bg-gray-50">
                            <div className="text-lg sm:text-2xl font-bold text-purple-500 capitalize">{session.difficulty}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">Difficulty</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6 flex-wrap">
                        <span className="tag-pill bg-indigo-50 text-indigo-600 border border-indigo-200">
                            {session.role_selected}
                        </span>
                        <span className="tag-pill bg-purple-50 text-purple-600 border border-purple-200">
                            {session.category}
                        </span>
                        <span className={`tag-pill ${score >= 7 ? 'bg-green-50 text-green-600 border border-green-200' : score >= 5 ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                            {score >= 7 ? 'Passed ✓' : score >= 5 ? 'Average' : 'Below Average'}
                        </span>
                    </div>
                </div>

                {/* Skill breakdown */}
                <div className="bg-white p-4 sm:p-5 md:p-7 mb-4 sm:mb-6 border border-gray-100 shadow-lg rounded-2xl fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 flex items-center gap-2 text-gray-900">
                        <TrendingUp size={18} className="text-indigo-600" />
                        Score Breakdown
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                        {questions.map((q, i) => {
                            const qScore = q.answers?.[0]?.ai_score || 0;
                            return (
                                <div key={q.id}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs sm:text-sm text-gray-500 font-medium">Question {i + 1}</span>
                                        <span className={`text-xs sm:text-sm font-bold ${qScore >= 7 ? 'text-green-500' : qScore >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {qScore}/10
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${qScore * 10}%`,
                                                background: qScore >= 7 ? 'linear-gradient(90deg, #10b981, #059669)' :
                                                    qScore >= 5 ? 'linear-gradient(90deg, #f59e0b, #d97706)' :
                                                        'linear-gradient(90deg, #ef4444, #dc2626)',
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Question-wise Review */}
                <div className="bg-white border border-gray-100 shadow-lg rounded-2xl mb-5 sm:mb-8 fade-in-up overflow-hidden" style={{ animationDelay: '0.2s' }}>
                    <div className="p-4 sm:p-5 md:p-6 border-b border-gray-50">
                        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-gray-900">
                            <Brain size={18} className="text-indigo-600" />
                            Question-by-Question Review
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {questions.map((q, i) => {
                            const ans = q.answers?.[0];
                            const feedback = ans?.ai_feedback;
                            const qScore = ans?.ai_score || 0;
                            const isOpen = expanded[q.id];

                            return (
                                <div key={q.id} className="p-4 sm:p-5 md:p-6">
                                    <button
                                        onClick={() => toggleExpand(q.id)}
                                        className="w-full flex items-center justify-between text-left gap-3"
                                    >
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold ${qScore >= 7 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                qScore >= 5 ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                    'bg-red-50 text-red-600 border border-red-100'
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2">{q.question_text}</p>
                                                {!isOpen && ans && (
                                                    <span className={`score-badge mt-2 text-[10px] sm:text-xs ${qScore >= 7 ? 'score-high' : qScore >= 5 ? 'score-mid' : 'score-low'}`}>
                                                        {qScore}/10
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-gray-400 shrink-0 ml-2">
                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </button>

                                    {isOpen && ans && (
                                        <div className="mt-4 space-y-3 sm:space-y-4 pl-0 sm:pl-11 md:pl-12">
                                            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                                                <p className="text-[10px] sm:text-xs text-gray-400 mb-1.5 font-bold uppercase tracking-wide">Your Answer</p>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">{ans.user_answer}</p>
                                            </div>

                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <h4 className="font-bold text-xs sm:text-sm text-gray-900">AI Evaluation</h4>
                                                <span className={`score-badge text-xs ${qScore >= 7 ? 'score-high' : qScore >= 5 ? 'score-mid' : 'score-low'}`}>
                                                    Score: {qScore}/10
                                                </span>
                                            </div>

                                            {feedback?.overall_feedback && (
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">{feedback.overall_feedback}</p>
                                            )}

                                            {feedback && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 border border-emerald-100">
                                                        <h5 className="text-[10px] sm:text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1">
                                                            <CheckCircle size={12} /> Strengths
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {feedback.strengths?.map((s, j) => (
                                                                <li key={j} className="text-[10px] sm:text-xs text-gray-600 font-medium">• {s}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="bg-orange-50 rounded-xl p-3 sm:p-4 border border-orange-100">
                                                        <h5 className="text-[10px] sm:text-xs font-bold text-orange-700 mb-2 flex items-center gap-1">
                                                            <AlertCircle size={12} /> Improvements
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {feedback.improvements?.map((tip, j) => (
                                                                <li key={j} className="text-[10px] sm:text-xs text-gray-600 font-medium">• {tip}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {feedback?.ideal_answer_summary && (
                                                <div className="bg-purple-50 rounded-xl p-3 sm:p-4 border border-purple-100">
                                                    <h5 className="text-[10px] sm:text-xs font-bold text-purple-700 mb-1">📚 Ideal Answer</h5>
                                                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed font-medium">{feedback.ideal_answer_summary}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isOpen && !ans && (
                                        <div className="mt-4 pl-0 sm:pl-11 md:pl-12 text-xs sm:text-sm text-gray-400 italic">
                                            No answer recorded for this question.
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <Link to="/setup" className="btn-primary flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 min-h-[48px]">
                        <RotateCcw size={18} />
                        Practice Again
                    </Link>
                    <Link to="/analytics" className="btn-secondary flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 min-h-[48px]">
                        <BarChart3 size={18} />
                        View Analytics
                    </Link>
                    <Link to="/dashboard" className="btn-secondary flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 min-h-[48px]">
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
