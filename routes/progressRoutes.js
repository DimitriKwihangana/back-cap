const express = require('express');
const ProgressRouter = express.Router();
const { completeModule, updateQuizScore , updateFinalQuiz} = require('../controllers/ProgressController');


/**
 * @swagger
 * /api/progress/complete-lesson:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Progress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *               moduleId:
 *                 type: string
 *                 description: ID of the module
 *               lessonId:
 *                 type: string
 *                 description: ID of the lesson
 *     responses:
 *       200:
 *         description: Lesson marked as completed
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/progress/complete-module:
 *   post:
 *     summary: Mark a module as completed if quiz score is 80+
 *     tags: [Progress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *               moduleId:
 *                 type: string
 *                 description: ID of the module
 *     responses:
 *       200:
 *         description: Module completed successfully
 *       400:
 *         description: Module not completed due to quiz score below 80
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/progress/update-quiz-score:
 *   post:
 *     summary: Update quiz score with retry limit and cooldown
 *     tags: [Progress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *               moduleId:
 *                 type: string
 *                 description: ID of the module
 *               score:
 *                 type: integer
 *                 description: New quiz score
 *     responses:
 *       200:
 *         description: Quiz score updated successfully
 *       400:
 *         description: Course not found in user progress
 *       403:
 *         description: Maximum attempts reached, try again after cooldown
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


// Route to mark a module as completed if quiz score is 80+
ProgressRouter.post('/api/progress/complete-module', completeModule);

// Route to update quiz score with retry limit and cooldown
ProgressRouter.post('/api/progress/update-quiz-score', updateQuizScore);

ProgressRouter.post('/api/progress/update-finalquiz-score', updateFinalQuiz);

module.exports = ProgressRouter;
