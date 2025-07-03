const User = require('../models/User');
const { sendVerificationEmail } = require('../service/emailService');

const loginPage = (req, res) => {
    if (!req.user) {
        return res.redirect('http://localhost:3000/login?error=Unauthorized');
    }

    if (!req.user.isVerified) {
        return res.redirect('http://localhost:3000/verify-email?message=Please');
    }

    res.redirect('http://localhost:3000/courses');
};

const googleCallback = async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("/");
      }
  
      // Generate JWT token for authentication
      const token = jwt.sign(
        { id: req.user.id },
        process.env.JWT_SECRET
      );
  
      res.status(200).json({
        status: "success",
        message: "User authenticated successfully",
        token,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        }
    });
      // Redirect to frontend with token in query params
      res.redirect(`https://course-back-2-00rq.onrender.com/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Google Callback Error:", error);
      res.redirect("/");
    }
  };

const profilePage = async (req, res) => {
    if (!req.user || !req.user.isVerified) {
        return res.send('Please verify your email to access this page.');
    }
    res.send(`Welcome, ${req.user.name}`);
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        return res.redirect('https://learning-platform-front-end.vercel.app/login');
        res.send('Email verified successfully. You can now log in.');

        res.status(200).json({
            status: "success",
            message: "Email verified successfully. You can now log in."
        });
    } catch (error) {
        console.error('Error verifying email:', error.message);
        res.status(500).send('Server error');
        res.status(500).json({
            status: "error",
            message: "Server error while verifying email"
        });
    }
};

const logout = async (req, res, next) => {
    try {
        await req.logout();
        res.clearCookie("token");
        res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        });
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    loginPage,
    googleCallback,
    profilePage,
    verifyEmail,
    logout,
};
