import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LayoutDashboard, BarChart3, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = user
        ? [
            { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
            { to: '/analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
            { to: '/profile', label: 'Profile', icon: <User size={16} /> },
        ]
        : [];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Brain size={22} className="text-white" />
                    </div>
                    <span className="font-bold text-xl gradient-text">InterviewAI</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive(link.to)
                                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Auth buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-300">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="btn-secondary text-sm py-2 px-5">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 rounded-xl hover:bg-white/5 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-white/5 mt-4 pt-4 px-6 pb-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5"
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                    {user ? (
                        <button
                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 pt-2">
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-center">Login</Link>
                            <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-center">Get Started</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
