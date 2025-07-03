const User = require('../models/User');
const { SubModule } = require("../models/CourseSubModuleSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../service/emailService');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role, type,organisation } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists', status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'student',
            isVerified: true,
            verificationToken,
            type:type,
            organisation:organisation
        });

        await user.save();

        await sendVerificationEmail(user.email, verificationToken, user.password, user.username);
        

        res.status(201).json({
            message: 'User registered. A verification email has been sent.',
            status: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.', status: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', status: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user,
            status: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Use nested population to properly fetch all related data
        const users = await User.find()
            .select('-password')
            .populate({
                path: 'courses.courseId',
                select: 'title name modules',
                populate: {
                    path: 'modules',
                    model: 'CourseModule',
                    select: 'title description submodules',
                    populate: {
                        path: 'submodules',
                        model: 'SubModule',
                        select: 'title lessons'
                    }
                }
            });

        const now = Date.now();
        const usersWithProgress = users.map(user => {
            const updatedCourses = user.courses
                .filter(course => course.courseId)
                .map(course => {
                    // Calculate course progress: percentage of modules completed.
                    const totalModules = course.modules ? course.modules.length : 0;
                    const completedModulesCount = course.modules
                        ? course.modules.filter(mod => mod.completed).length
                        : 0;
                    const courseProgress = totalModules > 0
                        ? (completedModulesCount / totalModules) * 100
                        : 0;

                    // Build module-level details.
                    const updatedModules = (course.modules || []).map(mod => {
                        // Get the full populated module data
                        const moduleDoc = mod.moduleId;
                        // Calculate module progress based on submodules.
                        const totalSubmodules = moduleDoc?.submodules
                            ? moduleDoc.submodules.length
                            : (mod.submodules ? mod.submodules.length : 0);
                        const completedSubmodulesCount = mod.submodules
                            ? mod.submodules.filter(sub => sub.completed).length
                            : 0;
                        const moduleProgress = totalSubmodules > 0
                            ? (completedSubmodulesCount / totalSubmodules) * 100
                            : 0;

                        // Calculate if user can take quiz based on attempts and cooldown period
                        let canTakeQuiz = true;
                        if (mod.quizData && mod.quizData.attempts >= 2 && mod.quizData.lastAttempt) {
                            const cooldownPeriod = 1 * 60 * 1000; // 10 minutes in milliseconds
                            const timeSinceLastAttempt = now - new Date(mod.quizData.lastAttempt).getTime();
                            canTakeQuiz = timeSinceLastAttempt >= cooldownPeriod;
                        }

                        return {
                            moduleId: moduleDoc?._id,
                            moduleTitle: moduleDoc?.title,
                            completed: mod.completed,
                            quizData: mod.quizData,
                            canTakeQuiz,
                            totalSubmodules,
                            completedSubmodules: completedSubmodulesCount,
                            moduleProgress: moduleProgress.toFixed(2) + "%",
                            submodules: (mod.submodules || []).map(sub => ({
                                submoduleId: sub.submoduleId?._id,
                                submoduleTitle: sub.submoduleId?.title,
                                completed: sub.completed
                            }))
                        };
                    });

                    return {
                        courseId: course.courseId._id,
                        courseName: course.courseId.title,
                        completed: course.completed,
                        totalModules,
                        completedModules: completedModulesCount,
                        progress: courseProgress.toFixed(2) + "%",
                        finalQuizData: course.finalQuizData || null,
                        modules: updatedModules
                    };
                });

            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                courses: updatedCourses
            };
        });

        res.status(200).json({
            message: 'Users retrieved successfully',
            data: usersWithProgress,
            status: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch user and populate course data
        const user = await User.findById(id)
            .select('-password')
            .populate({
                path: 'courses.courseId',
                select: 'title name modules',
                populate: {
                    path: 'modules',
                    model: 'CourseModule',
                    select: 'title description submodules',
                    populate: {
                        path: 'submodules',
                        model: 'SubModule',
                        select: 'title lessons'
                    }
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        const now = Date.now();
        let hasChanges = false;

        const updatedCourses = user.courses
            .filter(course => course.courseId)
            .map(course => {
                // Sync user's module list with the course's current modules
                const courseModules = course.courseId.modules || [];

                // Ensure all course modules exist in user's progress
                courseModules.forEach(courseModule => {
                    const existingModuleIndex = course.modules.findIndex(
                        m => m.moduleId && m.moduleId._id.toString() === courseModule._id.toString()
                    );

                    if (existingModuleIndex === -1) {
                        // This is a new module, add it to user's progress
                        course.modules.push({
                            moduleId: courseModule._id,
                            completed: false,
                            quizData: {
                                score: 0,
                                attempts: 0
                            },
                            submodules: courseModule.submodules.map(submodule => ({
                                submoduleId: submodule._id,
                                completed: false
                            }))
                        });
                        hasChanges = true;
                    } else {
                        // Ensure all submodules exist for this module
                        const userModule = course.modules[existingModuleIndex];

                        courseModule.submodules.forEach(submodule => {
                            const existingSubmoduleIndex = userModule.submodules.findIndex(
                                s => s.submoduleId && s.submoduleId._id.toString() === submodule._id.toString()
                            );

                            if (existingSubmoduleIndex === -1) {
                                // This is a new submodule, add it
                                userModule.submodules.push({
                                    submoduleId: submodule._id,
                                    completed: false
                                });
                                hasChanges = true;
                            }
                        });
                    }
                });

                // Calculate progress metrics
                const totalModules = course.modules ? course.modules.length : 0;
                const completedModulesCount = course.modules
                    ? course.modules.filter(mod => mod.completed).length
                    : 0;
                const courseProgress = totalModules > 0
                    ? (completedModulesCount / totalModules) * 100
                    : 0;

                const updatedModules = (course.modules || []).map(mod => {
                    const moduleDoc = mod.moduleId;
                    const totalSubmodules = moduleDoc?.submodules
                        ? moduleDoc.submodules.length
                        : (mod.submodules ? mod.submodules.length : 0);
                    const completedSubmodulesCount = mod.submodules
                        ? mod.submodules.filter(sub => sub.completed).length
                        : 0;
                    const moduleProgress = totalSubmodules > 0
                        ? (completedSubmodulesCount / totalSubmodules) * 100
                        : 0;

                    let canTakeQuiz = true;
                    if (mod.quizData && mod.quizData.attempts >= 2 && mod.quizData.lastAttempt) {
                        const cooldownPeriod = 10 * 60 * 1000;
                        const timeSinceLastAttempt = now - new Date(mod.quizData.lastAttempt).getTime();
                        canTakeQuiz = timeSinceLastAttempt >= cooldownPeriod;
                    }

                    return {
                        moduleId: moduleDoc?._id,
                        moduleTitle: moduleDoc?.title,
                        completed: mod.completed,
                        quizData: mod.quizData,
                        canTakeQuiz,
                        totalSubmodules,
                        completedSubmodules: completedSubmodulesCount,
                        moduleProgress: moduleProgress.toFixed(2) + "%",
                        submodules: (mod.submodules || []).map(sub => ({
                            submoduleId: sub.submoduleId?._id,
                            submoduleTitle: sub.submoduleId?.title,
                            completed: sub.completed
                        }))
                    };
                });

                return {
                    courseId: course.courseId._id,
                    courseName: course.courseId.title,
                    completed: course.completed,
                    totalModules,
                    completedModules: completedModulesCount,
                    progress: courseProgress.toFixed(2) + "%",
                    finalQuizData: course.finalQuizData || null,
                    modules: updatedModules
                };
            });

        // Save user if any changes were made to their course structure
        if (hasChanges) {
            await user.save();
        }

        const userWithProgress = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            courses: updatedCourses
        };

        res.status(200).json({
            message: 'User retrieved successfully',
            data: userWithProgress,
            status: true
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: error.message, status: false });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully', status: true });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

const updateUserCourseProgress = async (req, res) => {
    const { userId } = req.params;
    const { courseId, finalQuizData, completed } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
      // 🔍 Log all course IDs for inspection
    console.log("User courses:", user.courses.map(c => c.courseId.toString()));
    console.log("Incoming courseId:", courseId.toString());

    //   const course = user.courses.find(c => {
    //     const cid = typeof c.courseId === 'object'
    //       ? c.courseId._id?.toString() || c.courseId.toString()
    //       : c.courseId.toString();
    //     return cid === courseId.toString();
    //   });
  
    const course = user.courses.find(c => c.courseId.toString() === courseId.toString());
    if (!course) return res.status(404).json({ success: false, message: 'Course not found in user' });

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found in user' });
      }
  
      course.finalQuizData = {
        ...finalQuizData,
        attempts: (course.finalQuizData?.attempts || 0) + 1
      };
  
      if (completed) course.completed = true;
  
      await user.save();
  
      res.status(200).json({ success: true, message: 'Course progress updated', data: course });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserCourseProgress
};