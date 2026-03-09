const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const { data: user, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, role: role || 'user' }])
            .select('id, name, email, role, created_at')
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ success: false, message: 'Error creating user' });
        }

        const token = generateToken(user.id);

        // Send registration success email (async)
        sendEmail({
            email: user.email,
            subject: 'Welcome to InterviewAI! 🚀',
            message: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4f46e5;">InterviewAI</h1>
                    </div>
                    <p>Hello <strong>${user.name}</strong>,</p>
                    <p>Thank you for joining <strong>InterviewAI</strong>! We're excited to help you ace your next interview.</p>
                    <p>With our AI-powered platform, you can practice technical and behavioral interviews with real-time feedback and detailed analytics.</p>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Practicing Now</a>
                    </div>
                    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e0e0e0;">
                    <p style="text-align: center; color: #94a3b8; font-size: 12px;">&copy; 2024 InterviewAI Platform. Built with ❤️ and AI.</p>
                </div>
            `,
        }).catch(err => console.error('Email send error:', err));

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user.id);

        // Send login success email (async, don't wait for it to finish)
        sendEmail({
            email: user.email,
            subject: 'Login Successful - InterviewAI',
            message: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4f46e5;">InterviewAI</h1>
                    </div>
                    <p>Hello <strong>${user.name}</strong>,</p>
                    <p>This is a confirmation that you have successfully logged into your <strong>InterviewAI</strong> account.</p>
                    <p>If this wasn't you, please change your password immediately or contact our support.</p>
                    <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">Log Details:</p>
                        <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: bold;">Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    </div>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
                    </div>
                    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e0e0e0;">
                    <p style="text-align: center; color: #94a3b8; font-size: 12px;">&copy; 2024 InterviewAI Platform. Built with ❤️ and AI.</p>
                </div>
            `,
        }).catch(err => console.error('Email send error:', err));

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
