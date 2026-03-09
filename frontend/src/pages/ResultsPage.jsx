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
        <div className="relative w-36 h-36 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" />
                <circle
                    cx="60" cy="60" r={r} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.5s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold" style={{ color }}>{score}</span>
                <span className="text-xs text-gray-500 font-bold">/ 10</span>
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
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center text-center">
                <div>
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-500 mb-2">Results Not Found</h2>
                    <Link to="/dashboard" className="btn-primary inline-flex mt-4">Go to Dashboard</Link>
                </div>
            </div>
        );
    }

    const score = session.overall_score || 0;
    const scoreLabel = score >= 8 ? '🏆 Excellent!' : score >= 6 ? '👍 Good job!' : score >= 4 ? '📈 Keep practicing!' : '💪 Needs improvement';
    const answeredCount = questions.filter(q => q.answers?.length > 0).length;

    return (
        <div className="bg-white min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Overall Score Card */}
                <div className="bg-white p-10 mb-8 text-center border border-indigo-100 shadow-xl fade-in-up">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-5">
                        <Trophy size={26} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Interview Complete!</h1>
                    <p className="text-gray-600 font-medium mb-8">{scoreLabel}</p>

                    <ScoreRing score={score} />

                    <p className="text-gray-400 text-sm mt-6 mb-6">Overall Score</p>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-6 mt-2">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-400">{questions.length}</div>
                            <div className="text-xs text-gray-500 mt-1">Questions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{answeredCount}</div>
                            <div className="text-xs text-gray-500 mt-1">Answered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400 capitalize">{session.difficulty}</div>
                            <div className="text-xs text-gray-500 mt-1">Difficulty</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center mt-8 flex-wrap">
                        <span className="tag-pill bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {session.role_selected}
                        </span>
                        <span className="tag-pill bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {session.category}
                        </span>
                        <span className={`tag-pill ${score >= 7 ? 'bg-green-500/20 text-green-300' : score >= 5 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                            {score >= 7 ? 'Passed ✓' : score >= 5 ? 'Average' : 'Below Average'}
                        </span>
                    </div>
                </div>

                {/* Skill breakdown */}
                <div className="bg-white p-7 mb-6 border border-gray-100 shadow-xl rounded-2xl fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900">
                        <TrendingUp size={20} className="text-indigo-600" />
                        Score Breakdown
                    </h2>
                    <div className="space-y-4">
                        {questions.map((q, i) => {
                            const qScore = q.answers?.[0]?.ai_score || 0;
                            return (
                                <div key={q.id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-400">Question {i + 1}</span>
                                        <span className={`text-sm font-bold ${qScore >= 7 ? 'text-green-400' : qScore >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
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
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Question-wise Review */}
                <div className="bg-white border border-gray-100 shadow-xl rounded-2xl mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                            <Brain size={20} className="text-indigo-600" />
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
                                <div key={q.id} className="p-6">
                                    <button
                                        onClick={() => toggleExpand(q.id)}
                                        className="w-full flex items-center justify-between text-left"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${qScore >= 7 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                qScore >= 5 ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                    'bg-red-50 text-red-600 border border-red-100'
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 line-clamp-2">{q.question_text}</p>
                                                {!isOpen && ans && (
                                                    <span className={`score-badge mt-2 ${qScore >= 7 ? 'score-high' : qScore >= 5 ? 'score-mid' : 'score-low'}`}>
                                                        {qScore}/10
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 text-gray-500">
                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </button>

                                    {isOpen && ans && (
                                        <div className="mt-5 ml-13 space-y-4 pl-13" style={{ paddingLeft: '52px' }}>
                                            {/* Your answer */}
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wide">Your Answer</p>
                                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{ans.user_answer}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-sm text-gray-900">AI Evaluation</h4>
                                                <span className={`score-badge shadow-sm ${qScore >= 7 ? 'score-high' : qScore >= 5 ? 'score-mid' : 'score-low'}`}>
                                                    Score: {qScore}/10
                                                </span>
                                            </div>

                                            {feedback?.overall_feedback && (
                                                <p className="text-sm text-gray-600 leading-relaxed font-medium">{feedback.overall_feedback}</p>
                                            )}

                                            {feedback && (
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                                        <h5 className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1">
                                                            <CheckCircle size={12} /> Strengths
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {feedback.strengths?.map((s, j) => (
                                                                <li key={j} className="text-xs text-gray-600 font-medium">• {s}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                                        <h5 className="text-xs font-bold text-orange-700 mb-2 flex items-center gap-1">
                                                            <AlertCircle size={12} /> Improvements
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {feedback.improvements?.map((tip, j) => (
                                                                <li key={j} className="text-xs text-gray-600 font-medium">• {tip}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {feedback?.ideal_answer_summary && (
                                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                                    <h5 className="text-xs font-bold text-purple-700 mb-1">📚 Ideal Answer</h5>
                                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{feedback.ideal_answer_summary}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isOpen && !ans && (
                                        <div className="mt-4 pl-13 text-sm text-gray-500 italic" style={{ paddingLeft: '52px' }}>
                                            No answer recorded for this question.
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <Link to="/setup" className="btn-primary flex items-center gap-2 px-8 py-4">
                        <RotateCcw size={18} />
                        Practice Again
                    </Link>
                    <Link to="/analytics" className="btn-secondary flex items-center gap-2 px-8 py-4">
                        <BarChart3 size={18} />
                        View Analytics
                    </Link>
                    <Link to="/dashboard" className="btn-secondary flex items-center gap-2 px-8 py-4">
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
