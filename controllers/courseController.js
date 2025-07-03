// Import required modules
const mongoose = require('mongoose');
const SubModule = require('../models/CourseSubModuleSchema');
const CourseModule = require('../models/CourseModule');
const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary');
const multer = require("multer");
const fs = require("fs");
const upload = require('../config/multer');


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

// Create a new Course

const createCourse = async (req, res) => {
    try {

        const { title, description, instructor, modules, enrolledStudents, category, level, price } = req.body;

        if (!title || !description || !req.file) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Title, description, and image are required.' 
            });
        }

        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({
                status: 'error',
                message: 'A Course with this title already exists'
            });
        }

        // Upload image to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

        // Create a new course entry
        const course = new Course({
            title,
            image: cloudinaryResult.secure_url, // ✅ Cloudinary URL
            description,
            instructor,
            modules: modules || [],
            enrolledStudents: enrolledStudents || [],
            category: category || '',
            level: level || 'Beginner',
            price: Number(price) || 0,
        });

        // Save course to database
        const savedCourse = await course.save();

        res.status(201).json({
            status: 'success',
            message: 'Course created successfully',
            data: savedCourse,
        });
    } catch (err) {
        console.error('Error creating Course:', err.message);

        res.status(500).json({
            status: 'error',
            message: 'Failed to create Course',
            error: err.message,
        });
    }
};

// Get all Courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate({
                path: 'modules',
                populate: {
                    path: 'submodules',
                    model: 'SubModule',
                    populate: {
                        path: 'lessons.resources',
                        model: 'File' // Ensures that it populates from the File model
                    }
                }
            })
            .populate('instructor')
            .populate('enrolledStudents');

        res.status(200).json({
            status: 'success',
            message: 'Courses retrieved successfully',
            data: courses
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve Courses',
            error: err.message
        });
    }
};

// Get a single Course by ID
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id)
            .populate({
                path: 'modules',
                populate: {
                    path: 'submodules',
                    model: 'SubModule',
                    populate: {
                        path: 'lessons.resources',
                        model: 'File' // Ensures that it populates from the File model
                    }
                }
            })
            .populate('instructor')
            .populate('enrolledStudents');
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Course retrieved successfully',
            data: course
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve Course',
            error: err.message
        });
    }
};

// Update a Course by ID
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const imagePath = req.file ? req.file.path : req.body.image; // Use uploaded image or existing one

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {
                ...req.body,
                image: imagePath
            },
            { new: true }
        ).populate('modules').populate('instructor').populate('enrolledStudents');

        if (!updatedCourse) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Course updated successfully',
            data: updatedCourse
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update Course',
            error: err.message
        });
    }
};

// Delete a Course by ID
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Course deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete Course',
            error: err.message
        });
    }
};

// Export the controllers
module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};
