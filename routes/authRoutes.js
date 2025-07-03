const express = require('express');
const passport = require('passport');
const { loginPage, googleCallback, profilePage, verifyEmail, logout } = require('../controllers/authController');

const router = express.Router();

router.get('/', loginPage);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);
router.get('/profile', profilePage);
router.get('/verify-email', verifyEmail);
router.get('/logout', logout);

module.exports = router;
