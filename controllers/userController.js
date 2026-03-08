const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/user/profile
const getProfile = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .eq('id', req.user.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get stats
        const { data: sessions } = await supabase
            .from('interview_sessions')
            .select('overall_score, status')
            .eq('user_id', req.user.id);

        const completed = sessions?.filter(s => s.status === 'completed') || [];
        const avgScore = completed.length > 0
            ? Math.round((completed.reduce((acc, s) => acc + (s.overall_score || 0), 0) / completed.length) * 10) / 10
            : 0;

        res.json({
            success: true,
            user,
            stats: {
                totalInterviews: sessions?.length || 0,
                completedInterviews: completed.length,
                averageScore: avgScore,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
const updateProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;

        const updateData = {};
        if (name) updateData.name = name;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: 'Current password required' });
            }

            const { data: user } = await supabase
                .from('users')
                .select('password')
                .eq('id', req.user.id)
                .single();

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }

            const salt = await bcrypt.genSalt(12);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', req.user.id)
            .select('id, name, email, role, created_at')
            .single();

        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to update profile' });
        }

        res.json({ success: true, message: 'Profile updated', user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
