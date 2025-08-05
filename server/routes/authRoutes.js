const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

// Registration and login
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', validateUserLogin, authController.login);

// Google OAuth routes
router.post('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// JWT token management
router.post('/refresh', authController.refreshToken);
router.post('/logout', auth, authController.logout);

// Password management
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, authController.changePassword);

// Email verification
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

// Check authentication status
router.get('/me', auth, authController.getCurrentUser);
router.post('/validate-token', authController.validateToken);

module.exports = router;