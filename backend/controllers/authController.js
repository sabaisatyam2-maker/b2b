const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ==========================================
// 1. Register User (Public)
// ==========================================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // IMPORTANT SECURITY CHECK
        if (role === 'admin') {
            return res.status(403).json({ message: 'Cannot register as admin' });
        }

        // Role 'vendor' hai toh wahi rakho, warna default 'user' kardo
        const assignedRole = (role === 'vendor') ? 'vendor' : 'user';

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Naya user create karte hain (pre-save hook khud password hash kar lega)
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: assignedRole,
        });

        // Response bhejte hain sath me JWT token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. Login User (Public)
// ==========================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Model mein password select:false tha, isliye yahan '.select("+password")' karna zaroori hai
        const user = await User.findOne({ email }).select('+password');

        // Agar user mila aur password sahi match hua (matchPassword method se)
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. Get Logged-in User Info (Private Route)
// ==========================================
const getMe = async (req, res) => {
    try {
        // req.user pichle 'protect' middleware ne set kiya hoga
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 4. Forgot Password (Public)
// ==========================================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        const successMessage = 'If that email is registered, a reset link has been sent.';

        if (!user) {
            return res.status(200).json({ message: successMessage });
        }

        const rawToken = user.generateResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

        const htmlMessage = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset for your BizSphere account.</p>
            <p>Please click on the link below to reset your password. This link will expire in 1 hour.</p>
            <a href="${resetUrl}" target="_blank">Reset Password</a>
            <br/><br/>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Reset your BizSphere password',
                html: htmlMessage,
            });

            res.status(200).json({ message: successMessage });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 5. Reset Password (Public)
// ==========================================
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset link' });
        }

        user.password = password;
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
};
