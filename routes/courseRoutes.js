const express = require('express');
const CourseRouter = express.Router();
const {   createCourse,getAllCourses,getCourseById,updateCourse,deleteCourse} = require('../controllers/courseController');
const upload = require('../config/multer');

/**
 * @swagger
 * tags:
 *   name: Course
 *   description: API for managing courses
 */

/**
 * @swagger
 * /api/course:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Course image file
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *         description: Title of the course
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *         description: Description of the course
 *       - in: formData
 *         name: instructor
 *         type: string
 *         required: true
 *         description: ID of the instructor
 *       - in: formData
 *         name: category
 *         type: string
 *         description: Course category
 *       - in: formData
 *         name: level
 *         type: string
 *         default: Beginner
 *         description: Difficulty level of the course
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Missing required fields or course already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/course:
 *   get:
 *     summary: Retrieve all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *       500:
 *         description: Failed to retrieve courses
 */

/**
 * @swagger
 * /api/course/{id}:
 *   get:
 *     summary: Retrieve a course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to retrieve course
 */

/**
 * @swagger
 * /api/course/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Course]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Updated course image
 *       - in: formData
 *         name: title
 *         type: string
 *         description: Updated title of the course
 *       - in: formData
 *         name: description
 *         type: string
 *         description: Updated description of the course
 *       - in: formData
 *         name: instructor
 *         type: string
 *         description: Updated instructor ID
 *       - in: formData
 *         name: category
 *         type: string
 *         description: Updated category
 *       - in: formData
 *         name: level
 *         type: string
 *         description: Updated level
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to update course
 */

/**
 * @swagger
 * /api/course/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to delete course
 */


CourseRouter.post('/api/course', upload.single('image') , createCourse);
CourseRouter.get('/api/course', getAllCourses);
CourseRouter.get('/api/course/:id', getCourseById);
CourseRouter.put('/api/course/:id',upload.single('image'), updateCourse);
CourseRouter.delete('/api/course/:id', deleteCourse);

module.exports = CourseRouter;