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
                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'
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
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
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
                    className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition text-gray-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 mt-4 pt-4 px-6 pb-4 space-y-2 bg-white rounded-2xl shadow-xl mx-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.to)
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                    {user ? (
                        <button
                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
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
