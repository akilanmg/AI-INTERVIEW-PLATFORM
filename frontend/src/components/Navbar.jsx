import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LayoutDashboard, BarChart3, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Track scroll for navbar shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const navLinks = user
        ? [
            { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { to: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
            { to: '/profile', label: 'Profile', icon: <User size={18} /> },
        ]
        : [];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`navbar px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
                scrolled ? 'py-2 sm:py-2.5 shadow-md' : 'py-3 sm:py-3.5'
            }`}
            style={scrolled ? { background: 'rgba(255,255,255,0.95)' } : undefined}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="InterviewAI Home">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/40 group-hover:shadow-indigo-300/50 group-hover:scale-105 transition-all duration-300">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg sm:text-xl gradient-text tracking-tight">InterviewAI</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[40px] ${isActive(link.to)
                                ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100'
                                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Section */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50/80 border border-gray-100 min-h-[40px]">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                                aria-label="Logout"
                            >
                                <LogOut size={16} />
                                <span className="hidden lg:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link to="/login" className="btn-secondary text-sm py-2 px-5">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-primary text-sm py-2 px-5 gap-1.5">
                                <Sparkles size={14} />
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 relative z-50"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu-overlay md:hidden">
                    <div className="flex flex-col gap-2 max-w-md mx-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${isActive(link.to)
                                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                                    }`}
                            >
                                <span className={`p-2 rounded-xl border shadow-sm ${
                                    isActive(link.to)
                                        ? 'bg-indigo-50 border-indigo-100'
                                        : 'bg-white border-gray-100'
                                }`}>
                                    {link.icon}
                                </span>
                                {link.label}
                            </Link>
                        ))}
                        
                        <div className="h-px bg-gray-100 my-3"></div>
                        
                        {user ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-lg">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-gray-900 truncate">{user.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl text-base font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 active:bg-red-200 transition-all"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link 
                                    to="/login" 
                                    onClick={() => setMenuOpen(false)} 
                                    className="btn-secondary text-center py-4 text-base rounded-2xl"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setMenuOpen(false)} 
                                    className="btn-primary text-center py-4 text-base rounded-2xl gap-2"
                                >
                                    <Sparkles size={16} />
                                    Get Started Free
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
