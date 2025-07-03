const express = require('express');
const userRouter = express.Router();
const {registerUser, loginUser, getAllUsers, deleteUser, getUserById, updateUserCourseProgress} = require('../controllers/userController');
const  authenticate  = require('../middlewares/authMiddleware');
const { createUserByAdmin, updateUserById, deleteUserById, getAllUsersCreateUserByAdmin, getUserByIdCreateUserByAdmin } = require('../controllers/AdminController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [student, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access a protected route
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully accessed protected route
 *       401:
 *         description: Unauthorized access
 */

userRouter.post('/api/register', registerUser);
userRouter.post('/api/login', loginUser);
userRouter.get('/api/users', getAllUsers);
userRouter.get('/api/user/:id', getUserById);
userRouter.delete('/api/user/:id', deleteUser);
userRouter.put('/api/users/:userId/update-course', updateUserCourseProgress);

userRouter.post('/api/admin/create-user', createUserByAdmin);
userRouter.get('/api/admin/users', getAllUsersCreateUserByAdmin);
userRouter.get('/api/admin/users/:id', getUserByIdCreateUserByAdmin);
userRouter.put('/api/admin/users/:id', updateUserById);
userRouter.delete('/api/admin/users/:id', deleteUserById);


userRouter.get('/protected', authenticate, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You have accessed a protected route',
        user: req.user
    });
});

module.exports = userRouter;