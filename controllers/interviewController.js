const supabase = require('../config/supabase');
const openai = require('../config/openai');

// @desc    Create interview session
// @route   POST /api/interview/session
const createSession = async (req, res) => {
    try {
        const { role_selected, category, difficulty, num_questions } = req.body;
        const userId = req.user.id;

        if (!role_selected || !category || !difficulty || !num_questions) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const { data: session, error } = await supabase
            .from('interview_sessions')
            .insert([{
                user_id: userId,
                role_selected,
                category,
                difficulty,
                num_questions: parseInt(num_questions),
                status: 'in_progress',
            }])
            .select()
            .single();

        if (error) {
            console.error('Session creation error:', error);
            return res.status(500).json({ success: false, message: 'Failed to create session' });
        }

        res.status(201).json({ success: true, session });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Generate interview question using AI
// @route   POST /api/interview/generate-question
const generateQuestion = async (req, res) => {
    try {
        const { session_id, question_index, role_selected, category, difficulty } = req.body;

        const difficultyMap = {
            beginner: 'fresher with 0-1 years of experience',
            intermediate: 'mid-level professional with 2-4 years of experience',
            advanced: 'senior professional with 5+ years of experience',
        };

        const prompt = `Generate a unique, specific ${category} interview question for a ${difficultyMap[difficulty] || difficulty} ${role_selected}. 
    The question should be clear, focused, and appropriate for the difficulty level.
    Return ONLY the question text, no numbering, no extra text, no quotes.
    Make it different from common interview questions. Question ${question_index + 1} of the interview.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert technical interviewer. Generate precise, insightful interview questions.',
                },
                { role: 'user', content: prompt },
            ],
            max_tokens: 200,
            temperature: 0.8,
        });

        const questionText = completion.choices[0].message.content.trim();

        // Store question in DB
        const { data: question, error } = await supabase
            .from('questions')
            .insert([{
                session_id,
                question_text: questionText,
                question_index,
            }])
            .select()
            .single();

        if (error) {
            console.error('Question insert error:', error);
            return res.status(500).json({ success: false, message: 'Failed to store question' });
        }

        res.json({ success: true, question });
    } catch (error) {
        console.error('Generate question error:', error);
        if (error.code === 'insufficient_quota') {
            return res.status(429).json({ success: false, message: 'AI API quota exceeded. Please try again later.' });
        }
        res.status(500).json({ success: false, message: 'Failed to generate question' });
    }
};

// @desc    Submit answer and evaluate with AI
// @route   POST /api/interview/evaluate-answer
const evaluateAnswer = async (req, res) => {
    try {
        const { question_id, question_text, user_answer, role_selected, category, difficulty } = req.body;

        if (!user_answer || user_answer.trim().length < 5) {
            return res.status(400).json({ success: false, message: 'Please provide a meaningful answer' });
        }

        const prompt = `You are an expert interviewer evaluating a candidate's answer for a ${difficulty} ${role_selected} position in ${category}.

Question: "${question_text}"
Candidate's Answer: "${user_answer}"

Evaluate the answer and respond in EXACTLY this JSON format:
{
  "score": <number 1-10>,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement tip 1", "improvement tip 2"],
  "ideal_answer_summary": "A brief ideal answer summary",
  "overall_feedback": "One paragraph overall feedback"
}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert technical interviewer. Evaluate answers objectively and provide constructive feedback. Always respond with valid JSON.',
                },
                { role: 'user', content: prompt },
            ],
            max_tokens: 600,
            temperature: 0.3,
        });

        let evaluation;
        try {
            const content = completion.choices[0].message.content.trim();
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            evaluation = JSON.parse(jsonMatch ? jsonMatch[0] : content);
        } catch (parseError) {
            evaluation = {
                score: 6,
                strengths: ['Answer provided'],
                weaknesses: ['Could be more detailed'],
                improvements: ['Add more specific examples'],
                ideal_answer_summary: 'A comprehensive answer covering key concepts',
                overall_feedback: 'The answer shows basic understanding. Consider adding more technical depth.',
            };
        }

        // Store answer in DB
        const { data: answer, error } = await supabase
            .from('answers')
            .insert([{
                question_id,
                user_answer,
                ai_score: evaluation.score,
                ai_feedback: evaluation,
            }])
            .select()
            .single();

        if (error) {
            console.error('Answer insert error:', error);
            return res.status(500).json({ success: false, message: 'Failed to store answer' });
        }

        res.json({ success: true, evaluation, answer });
    } catch (error) {
        console.error('Evaluate answer error:', error);
        res.status(500).json({ success: false, message: 'Failed to evaluate answer' });
    }
};

// @desc    Complete interview session
// @route   PUT /api/interview/session/:id/complete
const completeSession = async (req, res) => {
    try {
        const { id } = req.params;

        // Get all questions and answers for this session
        const { data: questions, error: qError } = await supabase
            .from('questions')
            .select(`
        id, question_text, question_index,
        answers (id, user_answer, ai_score, ai_feedback)
      `)
            .eq('session_id', id)
            .order('question_index', { ascending: true });

        if (qError) {
            return res.status(500).json({ success: false, message: 'Failed to fetch questions' });
        }

        // Calculate overall score
        const scores = questions
            .map(q => q.answers?.[0]?.ai_score || 0)
            .filter(s => s > 0);

        const overallScore = scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
            : 0;

        // Update session
        const { data: session, error: sError } = await supabase
            .from('interview_sessions')
            .update({ status: 'completed', overall_score: overallScore, completed_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (sError) {
            return res.status(500).json({ success: false, message: 'Failed to complete session' });
        }

        res.json({ success: true, session, questions, overallScore });
    } catch (error) {
        console.error('Complete session error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get session results
// @route   GET /api/interview/session/:id/results
const getSessionResults = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: session, error: sError } = await supabase
            .from('interview_sessions')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .single();

        if (sError || !session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        const { data: questions, error: qError } = await supabase
            .from('questions')
            .select(`
        id, question_text, question_index,
        answers (id, user_answer, ai_score, ai_feedback)
      `)
            .eq('session_id', id)
            .order('question_index', { ascending: true });

        if (qError) {
            return res.status(500).json({ success: false, message: 'Failed to fetch results' });
        }

        res.json({ success: true, session, questions });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get user's interview history
// @route   GET /api/interview/history
const getInterviewHistory = async (req, res) => {
    try {
        const { data: sessions, error } = await supabase
            .from('interview_sessions')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch history' });
        }

        res.json({ success: true, sessions });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createSession,
    generateQuestion,
    evaluateAnswer,
    completeSession,
    getSessionResults,
    getInterviewHistory,
};
