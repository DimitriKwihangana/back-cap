const CourseModule = require('../models/CourseModule');

exports.addQuizToModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { title, questions } = req.body;

        if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a quiz title and at least one question'
            });
        }

        const isValidQuestions = questions.every(q => 
            q.question && 
            Array.isArray(q.options) && 
            q.options.length > 0 && 
            Array.isArray(q.correctAnswer) && 
            q.correctAnswer.length > 0 && 
            q.correctAnswer.every(answer => q.options.includes(answer))
        );

        if (!isValidQuestions) {
            return res.status(400).json({
                success: false,
                message: 'Each question must have a question text, an array of options, and an array of valid correct answers'
            });
        }

        const updatedModule = await CourseModule.findByIdAndUpdate(
            moduleId,
            { $set: { quiz: { title, questions } } },
            { new: true, runValidators: true }
        );

        if (!updatedModule) {
            return res.status(404).json({
                success: false,
                message: 'Course module not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quiz added successfully',
            data: updatedModule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding quiz to module',
            error: error.message
        });
    }
};

exports.updateModuleQuiz = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { title, questions } = req.body;

        if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a quiz title and at least one question'
            });
        }

        const isValidQuestions = questions.every(q => 
            q.question && 
            Array.isArray(q.options) && 
            q.options.length > 0 && 
            Array.isArray(q.correctAnswer) && 
            q.correctAnswer.length > 0 && 
            q.correctAnswer.every(answer => q.options.includes(answer))
        );

        if (!isValidQuestions) {
            return res.status(400).json({
                success: false,
                message: 'Each question must have a question text, an array of options, and an array of valid correct answers'
            });
        }

        // Find and update the module quiz
        const updatedModule = await CourseModule.findByIdAndUpdate(
            moduleId,
            { $set: { 'quiz.title': title, 'quiz.questions': questions } },
            { new: true, runValidators: true }
        );

        if (!updatedModule) {
            return res.status(404).json({
                success: false,
                message: 'Course module not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quiz updated successfully',
            data: updatedModule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating module quiz',
            error: error.message
        });
    }
};


exports.deleteModuleQuiz = async (req, res) => {
    try {
        const { moduleId } = req.params;

        const updatedModule = await CourseModule.findByIdAndUpdate(
            moduleId,
            {
                $unset: { quiz: "" }
            },
            { new: true }
        );

        if (!updatedModule) {
            return res.status(404).json({
                success: false,
                message: 'Course module not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedModule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting module quiz',
            error: error.message
        });
    }
};