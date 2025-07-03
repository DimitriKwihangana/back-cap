const express = require('express');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const CourseModule = require('../models/CourseModule');
const User = require('../models/User');
const multer = require("multer");

const enrollStudent = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        // Find the course and populate its modules and submodules
        const course = await Course.findById(courseId)
            .populate({
                path: 'modules',
                model: 'CourseModule',
                populate: {
                    path: 'submodules',
                    model: 'SubModule'
                }
            });

        if (!course) {
            return res.status(404).json({ message: 'Course not found', status: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }
        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
        }

        if (!user.courses.some(c => c.courseId && c.courseId.toString() === courseId)) {
            // Create a properly structured course entry with modules and submodules
            const courseEntry = {
                courseId: course._id,
                completed: false,
                finalQuizData: {
                    score: null,
                    passed: null,
                    submittedAt: null
                },
                modules: course.modules.map(module => {
                    return {
                        moduleId: module._id,
                        completed: false,
                        quizData: {
                            score: 0,
                            attempts: 0
                        },
                        submodules: module.submodules.map(submodule => {
                            return {
                                submoduleId: submodule._id,
                                completed: false
                            };
                        })
                    };
                })
            };

            user.courses.push(courseEntry);
            await user.save();
        }

        res.status(200).json({
            message: 'Enrollment successful',
            status: true
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            status: false
        });
    }
};

const unenrollStudent = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found', status: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        // Remove student from course enrolledStudents array
        course.enrolledStudents = course.enrolledStudents.filter(id => id.toString() !== userId);
        await course.save();

        // Remove course from user's courses array
        user.courses = user.courses.filter(c => c.courseId && c.courseId.toString() !== courseId);
        await user.save();

        res.status(200).json({
            message: 'Unenrollment successful',
            status: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            status: false
        });
    }
};

// Optional: Add a function to get enrollment status
const getEnrollmentStatus = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        const isEnrolled = user.courses.some(c => c.courseId && c.courseId.toString() === courseId);

        res.status(200).json({
            isEnrolled,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            status: false
        });
    }
};

// Optional: Get all enrolled courses for a user with full details
const getUserEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate({
                path: 'courses.courseId',
                select: 'name description image price level category',
                populate: {
                    path: 'modules',
                    model: 'CourseModule',
                    select: 'title description',
                    populate: {
                        path: 'submodules',
                        model: 'SubModule',
                        select: 'title'
                    }
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        // Format the response
        const enrolledCourses = user.courses.map(course => {
            // Calculate progress
            const totalModules = course.modules.length;
            const completedModules = course.modules.filter(m => m.completed).length;
            const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

            return {
                course: course.courseId,
                progress: progress.toFixed(2) + '%',
                completed: course.completed,
                enrollmentDetails: {
                    completedModules,
                    totalModules
                }
            };
        });

        res.status(200).json({
            message: 'User enrolled courses retrieved successfully',
            data: enrolledCourses,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            status: false
        });
    }
};

module.exports = {
    enrollStudent,
    unenrollStudent,
    getEnrollmentStatus,
    getUserEnrolledCourses
};