const supabase = require('../config/supabase');

// @desc    Get performance analytics for user
// @route   GET /api/analytics
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all completed sessions
        const { data: sessions, error: sError } = await supabase
            .from('interview_sessions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('created_at', { ascending: true });

        if (sError) {
            return res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
        }

        // Score trend over time
        const scoreTrend = sessions.map((s) => ({
            date: new Date(s.created_at).toLocaleDateString('en-IN'),
            score: s.overall_score || 0,
            role: s.role_selected,
            category: s.category,
        }));

        // Category breakdown
        const categoryBreakdown = {};
        const roleBreakdown = {};
        const difficultyBreakdown = {};

        sessions.forEach((s) => {
            if (s.category) {
                if (!categoryBreakdown[s.category]) categoryBreakdown[s.category] = { total: 0, count: 0 };
                categoryBreakdown[s.category].total += s.overall_score || 0;
                categoryBreakdown[s.category].count += 1;
            }
            if (s.role_selected) {
                if (!roleBreakdown[s.role_selected]) roleBreakdown[s.role_selected] = { total: 0, count: 0 };
                roleBreakdown[s.role_selected].total += s.overall_score || 0;
                roleBreakdown[s.role_selected].count += 1;
            }
            if (s.difficulty) {
                if (!difficultyBreakdown[s.difficulty]) difficultyBreakdown[s.difficulty] = { total: 0, count: 0 };
                difficultyBreakdown[s.difficulty].total += s.overall_score || 0;
                difficultyBreakdown[s.difficulty].count += 1;
            }
        });

        const formatBreakdown = (obj) =>
            Object.entries(obj).map(([key, val]) => ({
                name: key,
                avgScore: Math.round((val.total / val.count) * 10) / 10,
                count: val.count,
            }));

        const totalInterviews = sessions.length;
        const avgScore = totalInterviews > 0
            ? Math.round((sessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / totalInterviews) * 10) / 10
            : 0;
        const bestScore = totalInterviews > 0 ? Math.max(...sessions.map((s) => s.overall_score || 0)) : 0;
        const recentScore = sessions.length > 0 ? sessions[sessions.length - 1].overall_score || 0 : 0;

        res.json({
            success: true,
            analytics: {
                summary: { totalInterviews, avgScore, bestScore, recentScore },
                scoreTrend,
                categoryBreakdown: formatBreakdown(categoryBreakdown),
                roleBreakdown: formatBreakdown(roleBreakdown),
                difficultyBreakdown: formatBreakdown(difficultyBreakdown),
            },
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getAnalytics };
