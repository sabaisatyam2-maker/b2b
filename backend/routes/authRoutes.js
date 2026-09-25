const express = require('express');
const router = express.Router();

// Controllers import kar rahe hain (Curly braces kyunki unhe object ki tarah export kiya tha)
const { 
    registerUser, 
    loginUser, 
    getMe, 
    forgotPassword,
    resetPassword 
} = require('../controllers/authController');

// Auth Middleware import kar rahe hain
const { protect } = require('../middleware/auth');

// ==========================================
// Auth Routes
// ==========================================

// Public Route: User Registration (No Middleware)
router.post('/register', registerUser);

// Public Route: User Login (No Middleware)
router.post('/login', loginUser);

// Private Route: Get My Profile (Requires 'protect' middleware)
router.get('/me', protect, getMe);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
