const express = require('express');
const upload = require('../config/multer');

const EnrollmentRouter = express.Router();
const { enrollStudent, unenrollStudent } = require('../controllers/EnrollmentController');

/**
 * @swagger
 * tags:
 *   name: Enroll
 *   description: API for student enrollment and unenrollment
 */

/**
 * @swagger
 * /api/enroll:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Enroll]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, courseId]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65dfec1a2fbd994a0c45c123"
 *               courseId:
 *                 type: string
 *                 example: "65dfec1a2fbd994a0c45c543"
 *     responses:
 *       200:
 *         description: Enrollment successful
 *       404:
 *         description: Course or User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/unenroll:
 *   post:
 *     summary: Unenroll a student from a course
 *     tags: [Enroll]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, courseId]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65dfec1a2fbd994a0c45c123"
 *               courseId:
 *                 type: string
 *                 example: "65dfec1a2fbd994a0c45c543"
 *     responses:
 *       200:
 *         description: Unenrollment successful
 *       404:
 *         description: Course or User not found
 *       500:
 *         description: Server error
 */

EnrollmentRouter.post('/api/enroll/:userId/:courseId', enrollStudent);
EnrollmentRouter.post('/api/unenroll/:userId/:courseId', unenrollStudent);

module.exports = EnrollmentRouter;
 