const mongoose = require('mongoose');
const Course = require('./Course');  
const CourseModule = require('./CourseModule');  
const CourseSubModule = require('./CourseSubModuleSchema');  

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    username: {
        type: String,
        required: function () {
            return !this.googleId;
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        
    },
    organisation: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
    },
    courses: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            completed: { type: Boolean, default: false },
            finalQuizData: {          
                score: { type: Number },
                passed: { type: Boolean },
                attempts: { type: Number},
                lastAttempt: { type: Date }
              },
            modules: [
                {
                    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModule' },
                    completed: { type: Boolean, default: false },
                    quizData: {
                        score: { type: Number },
                        attempts: { type: Number, default: 0 },
                        lastAttempt: { type: Date }
                    },
                    submodules: [
                        {
                            submoduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
                            completed: { type: Boolean, default: false },
                        },
                    ],
                },
            ],
        },
    ],
    googleProfile: {
        name: String,
        profileImage: String,
        googleAccessToken: String,
        googleRefreshToken: String,
    },
});

module.exports = mongoose.model('User', UserSchema);
