const express = require('express');
const SubModuleRouter = express.Router();
const upload = require('../config/multer');
const SubModuleR = require('../controllers/SubmoduleMainControler');
const uploadSubModuleRouter = require('../controllers/SubmoduleController'); // Import the upload route

/**
 * @swagger
 * /api/submodules:
 *   get:
 *     summary: Get all submodules
 *     tags: [SubModules]
 *     responses:
 *       200:
 *         description: SubModules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: SubModules retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       lessons:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 *                             description:
 *                               type: string
 *                             videoUrl:
 *                               type: string
 *                             resources:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/File'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/submodules/{id}:
 *   get:
 *     summary: Get a submodule by ID
 *     tags: [SubModules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubModule ID
 *     responses:
 *       200:
 *         description: SubModule retrieved successfully
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
 *                   $ref: '#/components/schemas/SubModule'
 *       404:
 *         description: SubModule not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/submodules/{id}:
 *   delete:
 *     summary: Delete a submodule
 *     tags: [SubModules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubModule ID
 *     responses:
 *       200:
 *         description: SubModule deleted successfully
 *       404:
 *         description: SubModule not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/submodules:
 *   post:
 *     summary: Create a new submodule with PDF
 *     tags: [SubModules]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title
 *               - moduleId
 *               - lessons
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to upload
 *               title:
 *                 type: string
 *               moduleId:
 *                 type: string
 *               lessons:
 *                 type: string
 *                 description: JSON string of lessons array
 *     responses:
 *       201:
 *         description: SubModule created successfully
 *       400:
 *         description: Invalid input or file type
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/submodules/{id}:
 *   put:
 *     summary: Update a submodule
 *     tags: [SubModules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubModule ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional PDF file to update
 *               title:
 *                 type: string
 *               lessons:
 *                 type: string
 *                 description: JSON string of lessons array
 *     responses:
 *       200:
 *         description: SubModule updated successfully
 *       404:
 *         description: SubModule not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/submodules:
 *   get:
 *     summary: Get all files
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         originalName:
 *           type: string
 *         storedName:
 *           type: string
 *         pdfUrl:
 *           type: string
 *         path:
 *           type: string
 *     SubModule:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         lessons:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               resources:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/File'
 */

SubModuleRouter.get('/api/submodules', SubModuleR.getAllSubModules);
SubModuleRouter.get('/api/submodules/:id', SubModuleR.getSubModuleById);
SubModuleRouter.delete('/api/submodules/:id', SubModuleR.deleteSubModule);
SubModuleRouter.patch('/api/submodules/:id/complete', SubModuleR.toggleSubmoduleCompletion);

//post and put and get, for everything to do with resources
SubModuleRouter.use('/api/v1/submodules', uploadSubModuleRouter); // Mount the upload route

module.exports = SubModuleRouter;
