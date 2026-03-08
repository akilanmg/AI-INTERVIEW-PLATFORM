import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Shield, Calendar, Trophy, Loader2, CheckCircle } from 'lucide-react';

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
            <div className="hero-bg min-h-screen flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-indigo-400" />
            </div>
        );
    }

    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'Unknown';

    return (
        <div className="hero-bg min-h-screen py-12 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 fade-in-up">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 pulse-glow">
                        <span className="text-4xl font-bold text-white">
                            {profile?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold">{profile?.name}</h1>
                    <p className="text-gray-400 mt-1">{profile?.email}</p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        Member since {joinDate}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {[
                        { icon: <Trophy size={20} className="text-yellow-400" />, label: 'Total', value: stats?.totalInterviews || 0 },
                        { icon: <CheckCircle size={20} className="text-green-400" />, label: 'Completed', value: stats?.completedInterviews || 0 },
                        { icon: <Shield size={20} className="text-indigo-400" />, label: 'Avg Score', value: stats?.averageScore ? `${stats.averageScore}/10` : 'N/A' },
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-5 text-center border-white/10">
                            <div className="flex justify-center mb-2">{s.icon}</div>
                            <div className="text-2xl font-bold">{s.value}</div>
                            <div className="text-gray-400 text-xs mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Update form */}
                <div className="glass-card p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <User size={20} className="text-indigo-400" />
                        Update Profile
                    </h2>

                    <form onSubmit={handleUpdate} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    className="input-field pl-12"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email (Read-only)</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    className="input-field pl-12 opacity-60"
                                    value={profile?.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <hr className="border-white/10" />
                        <h3 className="font-medium text-gray-300 flex items-center gap-2">
                            <Lock size={16} className="text-purple-400" />
                            Change Password <span className="text-gray-500 text-sm font-normal">(optional)</span>
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    className="input-field pl-12"
                                    value={form.currentPassword}
                                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        className="input-field pl-12"
                                        value={form.newPassword}
                                        onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                        placeholder="New password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        className="input-field pl-12"
                                        value={form.confirmNew}
                                        onChange={e => setForm({ ...form, confirmNew: e.target.value })}
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving changes...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
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
