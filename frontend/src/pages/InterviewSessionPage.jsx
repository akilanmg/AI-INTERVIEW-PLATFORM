import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
    Brain, Mic, MicOff, Send, ChevronRight, Clock,
    CheckCircle, AlertCircle, Loader2, Volume2, VolumeX
} from 'lucide-react';

const InterviewSessionPage = () => {
    const { id: sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
    const [timerActive, setTimerActive] = useState(false);
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState('');

    const numQuestions = state?.num_questions || 5;
    const timerRef = useRef(null);
    const recognitionRef = useRef(null);

    // Generate first question on mount
    useEffect(() => {
        generateQuestion(0);
    }, []);

    // Timer
    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && timerActive) {
            toast('⏰ Time\'s up! Consider submitting your answer.');
            setTimerActive(false);
        }
        return () => clearTimeout(timerRef.current);
    }, [timerActive, timeLeft]);

    const generateQuestion = useCallback(async (index) => {
        setLoading(true);
        setEvaluation(null);
        setAnswer('');
        setTranscript('');
        setTimeLeft(120);
        try {
            const { data } = await api.post('/interview/generate-question', {
                session_id: sessionId,
                question_index: index,
                role_selected: state?.role_selected,
                category: state?.category,
                difficulty: state?.difficulty,
            });
            setQuestion(data.question);
            setTimerActive(true);
        } catch (err) {
            toast.error('Failed to generate question. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [sessionId, state]);

    const handleSubmitAnswer = async () => {
        const finalAnswer = answer || transcript;
        if (!finalAnswer || finalAnswer.trim().length < 5) {
            return toast.error('Please provide a meaningful answer (at least 5 characters)');
        }
        setTimerActive(false);
        setSubmitting(true);
        try {
            const { data } = await api.post('/interview/evaluate-answer', {
                question_id: question.id,
                question_text: question.question_text,
                user_answer: finalAnswer,
                role_selected: state?.role_selected,
                category: state?.category,
                difficulty: state?.difficulty,
            });
            setEvaluation(data.evaluation);
            toast.success('Answer evaluated! 🎯');
        } catch (err) {
            toast.error('Evaluation failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = async () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= numQuestions) {
            // Complete interview
            setCompleting(true);
            try {
                await api.put(`/interview/session/${sessionId}/complete`);
                toast.success('Interview completed! 🎉');
                navigate(`/results/${sessionId}`);
            } catch (err) {
                toast.error('Failed to complete session');
            } finally {
                setCompleting(false);
            }
        } else {
            setCurrentIndex(nextIndex);
            generateQuestion(nextIndex);
        }
    };

    // Voice recording using Web Speech API
    const startRecording = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            return toast.error('Voice recording not supported in this browser. Please use Chrome.');
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript + ' ';
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            setTranscript(prev => prev + final);
            if (interim) setAnswer(transcript + final + interim);
        };

        recognition.onerror = () => {
            setRecording(false);
            toast.error('Voice recognition error');
        };

        recognition.onend = () => setRecording(false);

        recognitionRef.current = recognition;
        recognition.start();
        setRecording(true);
        toast.success('Recording started... speak your answer');
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setRecording(false);
        if (transcript) setAnswer(transcript);
        toast.success('Recording stopped');
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = ((currentIndex) / numQuestions) * 100;
    const isLastQuestion = currentIndex === numQuestions - 1;

    return (
        <div className="hero-bg min-h-screen py-10 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Brain size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-sm text-gray-900">{state?.role_selected} — {state?.category}</div>
                            <div className="text-xs text-gray-500 capitalize font-medium">{state?.difficulty} level</div>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${timeLeft <= 30 ? 'border-red-200 bg-red-50 text-red-600' :
                        timeLeft <= 60 ? 'border-yellow-200 bg-yellow-50 text-yellow-600' :
                            'border-gray-200 bg-white text-gray-700 shadow-sm'
                        }`}>
                        <Clock size={16} />
                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 font-medium">Question {currentIndex + 1} of {numQuestions}</span>
                        <span className="text-sm text-indigo-600 font-bold">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-card p-7 mb-6 border-indigo-500/20 fade-in-up">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                            <Brain size={16} className="text-indigo-600" />
                        </div>
                        <span className="text-sm font-bold text-indigo-600">AI Interviewer</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-3 py-4">
                            <Loader2 size={22} className="animate-spin text-indigo-600" />
                            <span className="text-gray-500 font-medium">Generating your question...</span>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-800 leading-relaxed font-semibold">
                            {question?.question_text}
                        </p>
                    )}
                </div>

                {/* Answer Section */}
                {!evaluation && !loading && (
                    <div className="glass-card p-7 mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                                <span className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-bold">✏</span>
                                Your Answer
                            </h3>

                            {/* Voice toggle */}
                            <button
                                onClick={recording ? stopRecording : startRecording}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${recording
                                    ? 'bg-red-50 border border-red-200 text-red-600 animate-pulse'
                                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
                                    }`}
                            >
                                {recording ? <MicOff size={16} /> : <Mic size={16} />}
                                {recording ? 'Stop Recording' : 'Voice Answer'}
                            </button>
                        </div>

                        <textarea
                            value={answer || transcript}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here... Be as detailed as possible. Explain your thought process, give examples, and cover edge cases."
                            rows={7}
                            className="input-field resize-none mb-4"
                            disabled={recording}
                        />

                        {recording && (
                            <div className="flex items-center gap-2 mb-4 text-red-400 text-sm">
                                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                                Listening... speak your answer clearly
                            </div>
                        )}

                        <button
                            onClick={handleSubmitAnswer}
                            disabled={submitting || (!answer && !transcript)}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    AI is evaluating your answer...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Submit Answer for AI Evaluation
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Evaluation Result */}
                {evaluation && (
                    <div className="space-y-5 fade-in-up">
                        {/* Score */}
                        <div className="glass-card p-7 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                    <CheckCircle size={20} className="text-emerald-600" />
                                    AI Evaluation
                                </h3>
                                <div className={`score-badge text-lg px-4 py-2 shadow-sm ${evaluation.score >= 7 ? 'score-high' :
                                    evaluation.score >= 5 ? 'score-mid' : 'score-low'
                                    }`}>
                                    {evaluation.score}/10
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed font-medium">{evaluation.overall_feedback}</p>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="glass-card p-6 border-emerald-100 bg-emerald-50/50">
                                <h4 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">
                                    <CheckCircle size={16} /> Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {evaluation.strengths?.map((s, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="glass-card p-6 border-orange-100 bg-orange-50/50">
                                <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                                    <AlertCircle size={16} /> Areas to Improve
                                </h4>
                                <ul className="space-y-2">
                                    {evaluation.weaknesses?.map((w, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="text-orange-500 mt-0.5">•</span> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Improvements */}
                        <div className="glass-card p-6 border-indigo-100 bg-indigo-50/50">
                            <h4 className="font-bold text-indigo-700 mb-3">💡 Improvement Tips</h4>
                            <ul className="space-y-2">
                                {evaluation.improvements?.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-indigo-500 font-bold mt-0.5">{i + 1}.</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Ideal answer */}
                        {evaluation.ideal_answer_summary && (
                            <div className="glass-card p-6 border-purple-100 bg-purple-50/50">
                                <h4 className="font-bold text-purple-700 mb-2">📚 Ideal Answer Summary</h4>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{evaluation.ideal_answer_summary}</p>
                            </div>
                        )}

                        {/* Next button */}
                        <button
                            onClick={handleNext}
                            disabled={completing}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
                        >
                            {completing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Completing interview...
                                </>
                            ) : isLastQuestion ? (
                                <>
                                    <CheckCircle size={18} />
                                    Finish Interview & See Results
                                </>
                            ) : (
                                <>
                                    Next Question
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewSessionPage;
