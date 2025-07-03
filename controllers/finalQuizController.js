const Course = require('../models/Course');

exports.addFinalQuizToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
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
            q.correctAnswer.every(ans => q.options.includes(ans))
        );

        if (!isValidQuestions) {
            return res.status(400).json({
                success: false,
                message: 'Each question must have a question, options, and valid correct answers'
            });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: { finalQuiz: { title, questions } } },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Final quiz added successfully',
            data: updatedCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding final quiz',
            error: error.message
        });
    }
};

exports.updateFinalQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;
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
            q.correctAnswer.every(ans => q.options.includes(ans))
        );

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: { 'finalQuiz.title': title, 'finalQuiz.questions': questions } },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Final quiz updated successfully',
            data: updatedCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating final quiz',
            error: error.message
        });
    }
};

exports.deleteFinalQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $unset: { finalQuiz: "" } },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Final quiz deleted successfully',
            data: updatedCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting final quiz',
            error: error.message
        });
    }
};
