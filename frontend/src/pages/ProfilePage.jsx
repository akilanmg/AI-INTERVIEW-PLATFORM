import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Shield, Calendar, Trophy, Loader2, CheckCircle, Save } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', currentPassword: '', newPassword: '', confirmNew: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/user/profile');
            setProfile(data.user);
            setStats(data.stats);
            setForm(prev => ({ ...prev, name: data.user.name }));
        } catch {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (form.newPassword && form.newPassword !== form.confirmNew) {
            return toast.error('New passwords do not match');
        }
        if (form.newPassword && form.newPassword.length < 6) {
            return toast.error('New password must be at least 6 characters');
        }

        setSaving(true);
        try {
            const payload = { name: form.name };
            if (form.newPassword) {
                payload.currentPassword = form.currentPassword;
                payload.newPassword = form.newPassword;
            }
            const { data } = await api.put('/user/profile', payload);
            setProfile(data.user);
            toast.success('Profile updated successfully!');
            setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNew: '' }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="hero-bg min-h-screen min-h-[100dvh] flex items-center justify-center">
                <Loader2 size={44} className="animate-spin text-indigo-600" />
            </div>
        );
    }

    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'Unknown';

    return (
        <div className="hero-bg min-h-screen min-h-[100dvh] py-5 sm:py-8 md:py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10 fade-in-up">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 pulse-glow shadow-xl">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            {profile?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate px-4">{profile?.name}</h1>
                    <p className="text-gray-500 font-medium mt-1 text-sm">{profile?.email}</p>
                    <div className="flex items-center justify-center gap-2 mt-2.5 text-xs sm:text-sm text-gray-400 font-semibold">
                        <Calendar size={14} />
                        Member since {joinDate}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5 sm:mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {[
                        { icon: <Trophy size={18} className="text-yellow-500" />, label: 'Total', value: stats?.totalInterviews || 0 },
                        { icon: <CheckCircle size={18} className="text-green-500" />, label: 'Completed', value: stats?.completedInterviews || 0 },
                        { icon: <Shield size={18} className="text-indigo-500" />, label: 'Avg Score', value: stats?.averageScore ? `${stats.averageScore}/10` : 'N/A' },
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-3 sm:p-4 md:p-5 text-center border border-gray-100 rounded-2xl">
                            <div className="flex justify-center mb-2">{s.icon}</div>
                            <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{s.value}</div>
                            <div className="text-gray-500 text-[10px] sm:text-xs font-medium mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Update form */}
                <div className="bg-white p-4 sm:p-5 md:p-7 rounded-2xl border border-gray-100 shadow-xl fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold mb-5 sm:mb-6 flex items-center gap-2 text-gray-900">
                        <User size={18} className="text-indigo-600" />
                        Update Profile
                    </h2>

                    <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="input-field pl-12"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name"
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Email (Read-only)</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    className="input-field pl-12 opacity-50 cursor-not-allowed"
                                    value={profile?.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100" />
                        <h3 className="font-bold text-sm sm:text-base text-gray-800 flex items-center gap-2">
                            <Lock size={16} className="text-indigo-600" />
                            Change Password <span className="text-gray-400 text-xs font-normal">(optional)</span>
                        </h3>

                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    className="input-field pl-12"
                                    value={form.currentPassword}
                                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        className="input-field pl-12"
                                        value={form.newPassword}
                                        onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                        placeholder="New password"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        className="input-field pl-12"
                                        value={form.confirmNew}
                                        onChange={e => setForm({ ...form, confirmNew: e.target.value })}
                                        placeholder="Repeat new password"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 min-h-[48px]"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving changes...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
