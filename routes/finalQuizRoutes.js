const express = require('express');
const router = express.Router();
const finalQuizController = require('../controllers/finalQuizController');

// Add final quiz to a course
router.post('/courses/:courseId/finalquiz', finalQuizController.addFinalQuizToCourse);

// Update final quiz of a course
router.put('/courses/:courseId/finalquiz', finalQuizController.updateFinalQuiz);

// Delete final quiz from a course
router.delete('/courses/:courseId/finalquiz', finalQuizController.deleteFinalQuiz);



module.exports = router;
