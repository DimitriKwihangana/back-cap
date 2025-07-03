// request.js

var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');

router.post('/', async function (req, res, next) {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://learning-platform-front-end.vercel.app/',
    'http://localhost:3001'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');

  const redirectUrl = 'https://learningplatformbackend-rlt2.onrender.com/oauth';
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
    prompt: 'consent'
  });

  res.json({ url: authorizeUrl });
});

module.exports = router;
