const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const SubModuleRouter = require('./routes/SubmoduleRoutes');
const ModuleRouter = require('./routes/ModuleRoutes');
const CourseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
const ProgressRouter = require('./routes/progressRoutes')
const EnrollmentRouter = require('./routes/EnrollmentRoutes');
const authRouter = require('./routes/oauth');
const requestRouter = require ('./routes/request');
const finalQuizRoutes = require('./routes/finalQuizRoutes');
const progressRoute = require('./routes/progressRoute'); // Adjust pat
const batchRoutes = require('./routes/batchRoutes')


const cors = require('cors');
const setupSwagger = require('./utils/Swagger');
const DiscussionRouter = require('./routes/discussionRoutes');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

app.use(cors({

    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'https://learning-platform-front-end.vercel.app', 'https://adminlearn.netlify.app'], // Allow both
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

setupSwagger(app);

// Debug Middleware (optional)
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Database connection
db.connect();



// app.use(cors({
//     origin: (origin, callback) => {
//       callback(null, true); // Allows all origins dynamically
//     },
//     credentials: true
//   }));
  
// Define Routes
app.use('/', userRouter);
app.use('/', SubModuleRouter);
app.use('/', ModuleRouter);
app.use('/', CourseRouter);
app.use('/', authRoutes);
app.use('/', ProgressRouter); 
app.use('/', EnrollmentRouter);
app.use('/oauth', authRouter);
app.use('/request', requestRouter);
app.use('/api/discussions', DiscussionRouter);
app.use('/', finalQuizRoutes);
app.use('/progress', progressRoute);
app.use('/api/batches', batchRoutes);



app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint not found" });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
