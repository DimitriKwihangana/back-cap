const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { SubModule, File } = require("../models/CourseSubModuleSchema");
const CourseModule = require('../models/CourseModule');
const Course = require('../models/Course');
const User = require('../models/User');

const dotenv = require("dotenv");
dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

// Get all SubModules
const getAllSubModules = async (req, res) => {
    try {
        const subModules = await SubModule.find().populate({
            path: 'lessons.resources',
            model: 'File' // Ensures that it populates from the File model
        });

        res.status(200).json({
            status: 'success',
            message: 'SubModules retrieved successfully',
            data: subModules
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve SubModules',
            error: err.message
        });
    }
};

// Get a single SubModule by ID
const getSubModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const subModule = await SubModule.findById(id).populate({
            path: 'lessons.resources',
            model: 'File'
        });

        if (!subModule) {
            return res.status(404).json({
                status: 'error',
                message: 'SubModule not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'SubModule retrieved successfully',
            data: subModule
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve SubModule',
            error: err.message
        });
    }
};

// Delete a SubModule by ID
const deleteSubModule = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubModule = await SubModule.findByIdAndDelete(id);
        if (!deletedSubModule) {
            return res.status(404).json({
                status: 'error',
                message: 'SubModule not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'SubModule deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete SubModule',
            error: err.message
        });
    }
};

// Add a lesson to a SubModule
const addLessonToSubModule = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = req.body;
        const subModule = await SubModule.findById(id);
        if (!subModule) {
            return res.status(404).json({
                status: 'error',
                message: 'SubModule not found'
            });
        }
        subModule.lessons.push(lesson);
        const updatedSubModule = await subModule.save();
        res.status(201).json({
            status: 'success',
            message: 'Lesson added successfully',
            data: updatedSubModule
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to add lesson',
            error: err.message
        });
    }
};

// Remove a lesson from a SubModule
const removeLessonFromSubModule = async (req, res) => {
    try {
        const { subModuleId, lessonId } = req.params;
        const subModule = await SubModule.findById(subModuleId);
        if (!subModule) {
            return res.status(404).json({
                status: 'error',
                message: 'SubModule not found'
            });
        }
        subModule.lessons = subModule.lessons.filter(lesson => lesson._id.toString() !== lessonId);
        const updatedSubModule = await subModule.save();
        res.status(200).json({
            status: 'success',
            message: 'Lesson removed successfully',
            data: updatedSubModule
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to remove lesson',
            error: err.message
        });
    }
};
const toggleSubmoduleCompletion = async (req, res) => {
    try {
      const { userId } = req.body;
      const subModuleId = req.params.id;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required", status: false });
      }
  
      // Find the submodule
      const subModule = await SubModule.findById(subModuleId);
      if (!subModule) {
        return res.status(404).json({ message: "SubModule not found", status: false });
      }
  
      // Find the parent module
      const module = await CourseModule.findOne({ submodules: subModuleId });
      if (!module) {
        return res.status(404).json({ message: "Parent module not found", status: false });
      }
  
      // Find the course
      let courseId;
      if (module.courseId) {
        courseId = module.courseId;
      } else {
        const course = await Course.findOne({ modules: module._id });
        if (!course) {
          return res.status(404).json({ message: "Course not found for this module", status: false });
        }
        courseId = course._id;
      }
  
      const moduleId = module._id;
  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found", status: false });
      }
  
      // Check if courses array exists
      if (!user.courses || !Array.isArray(user.courses)) {
        return res.status(404).json({ 
          message: "User has no courses", 
          status: false 
        });
      }
  
      // Find the course in user's courses array
      const courseIndex = user.courses.findIndex(
        course => course.courseId && course.courseId.toString() === courseId.toString()
      );
  
      if (courseIndex === -1) {
        return res.status(404).json({ 
          message: "User is not enrolled in this course", 
          status: false 
        });
      }
  
      // Check if modules array exists
      if (!user.courses[courseIndex].modules || !Array.isArray(user.courses[courseIndex].modules)) {
        // Initialize modules array if it doesn't exist
        user.courses[courseIndex].modules = [];
        return res.status(404).json({ 
          message: "Course has no modules in user's progress", 
          status: false 
        });
      }
  
      // Find the module in the course
      const moduleIndex = user.courses[courseIndex].modules.findIndex(
        module => module.moduleId && module.moduleId.toString() === moduleId.toString()
      );
  
      if (moduleIndex === -1) {
        return res.status(404).json({ 
          message: "Module not found in user's course progress", 
          status: false 
        });
      }
  
      // Check if submodules array exists
      if (!user.courses[courseIndex].modules[moduleIndex].submodules || 
          !Array.isArray(user.courses[courseIndex].modules[moduleIndex].submodules)) {
        // Initialize submodules array if it doesn't exist
        user.courses[courseIndex].modules[moduleIndex].submodules = [];
        return res.status(404).json({ 
          message: "Module has no submodules in user's progress", 
          status: false 
        });
      }
  
      // Find the submodule in the module
      const submoduleIndex = user.courses[courseIndex].modules[moduleIndex].submodules.findIndex(
        submodule => submodule.submoduleId && submodule.submoduleId.toString() === subModuleId.toString()
      );
  
      if (submoduleIndex === -1) {
        // If submodule not found, we could add it to the user's progress
        return res.status(404).json({ 
          message: "Submodule not found in user's module progress", 
          status: false 
        });
      }
  
      // Toggle the completion status
      const currentStatus = user.courses[courseIndex].modules[moduleIndex].submodules[submoduleIndex].completed;
      user.courses[courseIndex].modules[moduleIndex].submodules[submoduleIndex].completed = !currentStatus;
  
      // Update module completion status if all submodules are completed
      const allSubmodulesCompleted = user.courses[courseIndex].modules[moduleIndex].submodules.every(
        submodule => submodule.completed
      );
  
      user.courses[courseIndex].modules[moduleIndex].completed = allSubmodulesCompleted;
  
      // Update course completion status if all modules are completed
      if (allSubmodulesCompleted) {
        const allModulesCompleted = user.courses[courseIndex].modules.every(
          module => module.completed
        );
        
        user.courses[courseIndex].completed = allModulesCompleted;
      } else {
        // If a submodule is marked incomplete, ensure module and course are also marked incomplete
        user.courses[courseIndex].modules[moduleIndex].completed = false;
        user.courses[courseIndex].completed = false;
      }
  
      // Remove any completedModules property if it exists
      if (user.courses[courseIndex].completedModules) {
        delete user.courses[courseIndex].completedModules;
      }
  
      await user.save();
  
      // Create a simplified response
      const completionStatus = {
        courseId: courseId.toString(),
        moduleId: moduleId.toString(),
        submoduleId: subModuleId.toString(),
        completed: user.courses[courseIndex].modules[moduleIndex].submodules[submoduleIndex].completed,
        moduleCompleted: user.courses[courseIndex].modules[moduleIndex].completed,
        courseCompleted: user.courses[courseIndex].completed
      };
  
      res.status(200).json({ 
        message: `Submodule ${completionStatus.completed ? 'marked as completed' : 'marked as incomplete'}`,
        data: completionStatus,
        status: true 
      });
  
    } catch (error) {
      console.error("Error toggling submodule completion:", error);
      res.status(500).json({ 
        message: "Server error", 
        error: error.message,
        status: false
      });
    }
  };

// Export the controllers
module.exports = {
    getAllSubModules,
    getSubModuleById,
    deleteSubModule,
    addLessonToSubModule,
    removeLessonFromSubModule, 
    toggleSubmoduleCompletion
};