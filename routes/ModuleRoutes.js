const express = require('express');
const ModuleRouter = express.Router();

// Import module controllers
const { createCourseModule, getAllCourseModules, getCourseModuleById, updateCourseModule, deleteCourseModule, getCourseModulesByCourseId } = require('../controllers/ModuleController');

// Import quiz controllers
const { addQuizToModule, updateModuleQuiz, deleteModuleQuiz } = require('../controllers/quizController');

const upload = require('../config/multer');
/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Create a new course module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               submodules:
 *                 type: array
 *                 items:
 *                   type: string
 *               quiz:
 *                 type: object
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: CourseModule created successfully
 *       400:
 *         description: Title and Course ID are required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get all course modules
 *     tags: [Modules]
 *     responses:
 *       200:
 *         description: CourseModules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CourseModule'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Get a course module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course Module ID
 *     responses:
 *       200:
 *         description: CourseModule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseModule'
 *       404:
 *         description: CourseModule not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Update a course module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseModuleUpdate'
 *     responses:
 *       200:
 *         description: CourseModule updated successfully
 *       404:
 *         description: CourseModule not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Delete a course module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CourseModule deleted successfully
 *       404:
 *         description: CourseModule not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/{moduleId}/quiz:
 *   post:
 *     summary: Add a quiz to a module
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Quiz added successfully
 *       400:
 *         description: Invalid quiz format
 *       404:
 *         description: Course module not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/{moduleId}/quiz:
 *   put:
 *     summary: Update a module's quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       400:
 *         description: Invalid quiz format
 *       404:
 *         description: Course module not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/{moduleId}/quiz:
 *   delete:
 *     summary: Delete a module's quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Course module not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - question
 *         - options
 *         - correctAnswer
 *       properties:
 *         question:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: string
 *         correctAnswer:
 *           type: array
 *           items:
 *             type: string
 *     
 *     CourseModule:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         submodules:
 *           type: array
 *           items:
 *             type: string
 *         quiz:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             questions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *     
 *     CourseModuleUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         submodules:
 *           type: array
 *           items:
 *             type: string
 *         quiz:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             questions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 */

// Module routes
ModuleRouter.post('/api/modules', upload.none(), createCourseModule);
ModuleRouter.get('/api/modules', getAllCourseModules);
ModuleRouter.get('/api/modules/:id', getCourseModuleById);
ModuleRouter.get('/api/coursemodules/:id', getCourseModulesByCourseId);
ModuleRouter.put('/api/modules/:id',upload.none(), updateCourseModule);
ModuleRouter.delete('/api/modules/:id', deleteCourseModule);

// Quiz routes
ModuleRouter.post('/api/modules/:moduleId/quiz',upload.none(), addQuizToModule);
ModuleRouter.put('/api/modules/:moduleId/quiz',upload.none(),  updateModuleQuiz);
ModuleRouter.delete('/api/modules/:moduleId/quiz', deleteModuleQuiz);

module.exports = ModuleRouter;