// oauth.js
var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = await response.json();
  return data;
}
router.get("/", async function (req, res, next) {
  const code = req.query.code;

  try {
    const redirectUrl = "https://course-back-2-00rq.onrender.com/oauth"; // Backend URL
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );

    // Get tokens
    const tokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenResponse.tokens);

    // Get user data
    const userData = await getUserData(tokenResponse.tokens.access_token);

    console.log(userData, "___________________");

    // Check if user exists in MongoDB
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      user = new User({
        googleId: userData.sub,
        email: userData.email,
        username: userData.name,
        isVerified: true,
        googleProfile: {
          name: userData.name,
          profileImage: userData.picture,
          googleAccessToken: tokenResponse.tokens.access_token,
          googleRefreshToken: tokenResponse.tokens.refresh_token || null,
        },
      });

      await user.save();
    }

    // Redirect to frontend with user data
    res.redirect(
      `http://localhost:3000/oauth?user=${encodeURIComponent(JSON.stringify(user))}`
    );
  } catch (err) {
    console.log("Error during sign-in:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
