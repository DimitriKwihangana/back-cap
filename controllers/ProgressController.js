const User = require('../models/User');
const Course = require('../models/Course');
const CourseModule = require('../models/CourseModule');
const CourseSubModule = require('../models/CourseSubModuleSchema');

// Mark module as completed if quiz score is 80 and above
const completeModule = async (req, res) => {
    try {
        const { userId, courseId, moduleId } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        // Find the user's course progress
        const courseProgress = user.courses.find(course => 
            course.courseId.toString() === courseId
        );
        
        if (!courseProgress) {
            return res.status(400).json({ message: 'Course not found in user progress', status: false });
        }

        // Find the module within the course
        const moduleProgress = courseProgress.modules.find(module => 
            module.moduleId.toString() === moduleId
        );
        
        if (!moduleProgress) {
            return res.status(400).json({ message: 'Module not found in course progress', status: false });
        }

        // Check if quiz score meets minimum requirement
        if (!moduleProgress.quizData || !moduleProgress.quizData.score || moduleProgress.quizData.score < 80) {
            return res.status(400).json({ message: 'Module not completed: Quiz score below 80', status: false });
        }

        // Mark the module as completed
        moduleProgress.completed = true;
        
        // Save the updated user document
        await user.save();
        
        // Check if all modules in the course are completed
        const allModulesCompleted = courseProgress.modules.every(module => module.completed);
        if (allModulesCompleted) {
            courseProgress.completed = true;
            await user.save();
        }
        
        res.status(200).json({ message: 'Module completed successfully', status: true });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

const updateFinalQuiz = async (req, res) => {
    try {
        const { userId, courseId, score } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        // Find the user's course progress
        const courseProgress = user.courses.find(course =>
            course.courseId.toString() === courseId
        );

        if (!courseProgress) {
            return res.status(400).json({ message: 'Course not found in user progress', status: false });
        }

        const now = Date.now();

        // Initialize finalQuizData or ensure its fields are properly set
        if (!courseProgress.finalQuizData) {
            courseProgress.finalQuizData = {
                score: 0,
                attempts: 0,
                lastAttempt: null,
                passed: false
            };
        } else {
            courseProgress.finalQuizData.score = courseProgress.finalQuizData.score ?? 0;
            courseProgress.finalQuizData.attempts = courseProgress.finalQuizData.attempts ?? 0;
            courseProgress.finalQuizData.lastAttempt = courseProgress.finalQuizData.lastAttempt ?? null;
            courseProgress.finalQuizData.passed = courseProgress.finalQuizData.passed ?? false;
        }

        // Enforce attempt limit and cooldown (2 attempts, 10 min interval)
        if (
            courseProgress.finalQuizData.attempts >= 2 &&
            courseProgress.finalQuizData.lastAttempt &&
            (now - new Date(courseProgress.finalQuizData.lastAttempt).getTime()) < 10 * 60 * 1000
        ) {
            return res.status(403).json({
                message: 'Maximum attempts reached. Try again after 10 minutes.',
                status: false
            });
        }

        // Update finalQuizData
        courseProgress.finalQuizData.score = score;
        courseProgress.finalQuizData.attempts += 1;
        courseProgress.finalQuizData.lastAttempt = new Date();

        // Mark course as completed if score >= 80
        if (score >= 80) {
            courseProgress.finalQuizData.passed = true;
            courseProgress.completed = true;
        }

        await user.save();

        res.status(200).json({
            message: 'Final quiz score updated',
            status: true,
            passed: courseProgress.finalQuizData.passed,
            completed: courseProgress.completed
        });

    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};




const updateQuizScore = async (req, res) => {
    try {
        const { userId, courseId, moduleId, score } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        // Find the user's course progress
        const courseProgress = user.courses.find(course => 
            course.courseId.toString() === courseId
        );
        
        if (!courseProgress) {
            return res.status(400).json({ message: 'Course not found in user progress', status: false });
        }

        // Find the module within the course
        const moduleProgress = courseProgress.modules.find(module => 
            module.moduleId.toString() === moduleId
        );
        
        if (!moduleProgress) {
            return res.status(400).json({ message: 'Module not found in course progress', status: false });
        }

        const now = Date.now();

        // Initialize quizData if it doesn't exist
        if (!moduleProgress.quizData) {
            moduleProgress.quizData = {
                score: 0,
                attempts: 0,
                lastAttempt: null
            };
        }

        // Enforce attempt limit and cooldown
        if (
            moduleProgress.quizData.attempts >= 2 && 
            moduleProgress.quizData.lastAttempt &&
            (now - new Date(moduleProgress.quizData.lastAttempt).getTime()) < 10 * 60 * 1000
        ) {
            return res.status(403).json({ 
                message: 'Maximum attempts reached. Try again after 10 minutes.', 
                status: false 
            });
        }

        // Update score, attempts, and lastAttempt timestamp

        moduleProgress.quizData.score = score;
        moduleProgress.quizData.attempts += 1;
        moduleProgress.quizData.lastAttempt = new Date();

        // Auto-complete module if score is 80 or above
        if (score >= 80) {
            moduleProgress.completed = true;
        }

        await user.save();
        
        res.status(200).json({ 
            message: 'Quiz score updated', 
            status: true,
            completed: moduleProgress.completed
        });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

module.exports = { completeModule, updateQuizScore, updateFinalQuiz };