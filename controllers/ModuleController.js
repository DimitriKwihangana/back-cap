// Import required modules
const mongoose = require('mongoose');
const SubModule = require('../models/CourseSubModuleSchema');
const CourseModule = require('../models/CourseModule');
const QuizSchema = require('../models/QuizSchema');
const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');
const upload = require('../config/multer');

const createCourseModule = async (req, res) => {
    try {
        const { title, description, submodules, quiz, courseId } = req.body;

        if (!title || !courseId) {
            return res.status(400).json({
                status: "error",
                message: "Title and Course ID are required."
            });
        }

        // Create the CourseModule
        const courseModule = new CourseModule({
            title,
            description,
            submodules: submodules || [],
            quiz: quiz || null
        });

        const savedCourseModule = await courseModule.save();

        // Find the Course and add this module to its modules array
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found."
            });
        }

        course.modules.push(savedCourseModule._id);
        await course.save();

        res.status(201).json({
            status: "success",
            message: "CourseModule created and added to Course successfully",
            data: savedCourseModule
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to create CourseModule",
            error: err.message
        });
    }
};

// Get all CourseModules
const getAllCourseModules = async (req, res) => {
    try {
        const courseModules = await CourseModule.find()
            .populate({
                path: 'submodules',
                populate: {
                    path: 'lessons',
                    populate: {
                        path: 'resources'
                    }
                }
            });

        res.status(200).json({
            status: 'success',
            message: 'CourseModules retrieved successfully',
            data: courseModules
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve CourseModules',
            error: err.message
        });
    }
};

// Get a single CourseModule by ID
// const getCourseModuleById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const courseModule = await CourseModule.findById(id)
//             .populate({
//                 path: 'submodules',
//                 populate: {
//                     path: 'lessons',
//                     populate: {
//                         path: 'resources'
//                     }
//                 }
//             });

//         if (!courseModule) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'CourseModule not found'
//             });
//         }

//         res.status(200).json({
//             status: 'success',
//             message: 'CourseModule retrieved successfully',
//             data: courseModule
//         });
//     } catch (err) {
//         res.status(500).json({
//             status: 'error',
//             message: 'Failed to retrieve CourseModule',
//             error: err.message
//         });
//     }
// };
const getCourseModuleById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the course module
        const courseModule = await CourseModule.findById(id)
            .populate({
                path: 'submodules',
                populate: {
                    path: 'lessons',
                    populate: {
                        path: 'resources'
                    }
                }
            });

        if (!courseModule) {
            return res.status(404).json({
                status: 'error',
                message: 'CourseModule not found'
            });
        }

        // Find the course that contains this module
        const course = await Course.findOne({ modules: id });

        res.status(200).json({
            status: 'success',
            message: 'CourseModule retrieved successfully',
            data: {
                ...courseModule.toObject(),
                courseId: course ? course._id : null // Include courseId if found
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve CourseModule',
            error: err.message
        });
    }
};


const getCourseModulesByCourseId = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the course exists
        const course = await Course.findById(id);
        console.log(course)
        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found."
            });
        }

        // Find modules associated with the course
        const courseModules = await CourseModule.find({ _id: { $in: course.modules } })
            .populate({
                path: 'submodules',
                populate: {
                    path: 'lessons',
                    populate: {
                        path: 'resources'
                    }
                }
            });

        res.status(200).json({
            status: "success",
            message: "CourseModules retrieved successfully",
            data: courseModules
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve CourseModules",
            error: err.message
        });
    }
};


// Update a CourseModule by ID
const updateCourseModule = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedCourseModule = await CourseModule.findByIdAndUpdate(
            id,
            { new: true }
        ).populate('submodules');

        if (!updatedCourseModule) {
            return res.status(404).json({
                status: 'error',
                message: 'CourseModule not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'CourseModule updated successfully',
            data: updatedCourseModule
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update CourseModule',
            error: err.message
        });
    }
};

// Delete a CourseModule by ID
const deleteCourseModule = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourseModule = await CourseModule.findByIdAndDelete(id);
        if (!deletedCourseModule) {
            return res.status(404).json({
                status: 'error',
                message: 'CourseModule not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'CourseModule deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete CourseModule',
            error: err.message
        });
    }
};

// Export the controllers
module.exports = {
    createCourseModule,
    getAllCourseModules,
    getCourseModuleById,
    getCourseModulesByCourseId,
    updateCourseModule,
    deleteCourseModule
};
