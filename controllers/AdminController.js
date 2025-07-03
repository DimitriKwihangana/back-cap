const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../service/emailService');

const createUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, role = 'student', courseId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ status: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const argument = "argument"

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: true,
      courses: courseId ? [{ courseId }] : []
    });

    await user.save();

    await sendVerificationEmail(user.email, argument , password, user.username);

    res.status(201).json({ status: true, message: 'User created', data: user });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

const getAllUsersCreateUserByAdmin = async (req, res) => {
    try {
      const users = await User.find().populate('courses.courseId');
      res.json({ status: true, data: users });
    } catch (err) {
      res.status(500).json({ status: false, message: 'Failed to retrieve users' });
    }
  };
  
  // Get user by ID
  const getUserByIdCreateUserByAdmin = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('courses.courseId');
      if (!user) return res.status(404).json({ status: false, message: 'User not found' });
  
      res.json({ status: true, data: user });
    } catch (err) {
      res.status(500).json({ status: false, message: 'Failed to retrieve user' });
    }
  };
  
  // Update user by ID
//   const updateUserById = async (req, res) => {
//     try {
//       const { username, email, password, role, courseId } = req.body;
  
//       const updates = {
//         ...(username && { username }),
//         ...(email && { email }),
//         ...(role && { role }),
//         ...(courseId && { courses: [{ courseId }] })
//       };
  
//       if (password) {
//         updates.password = await bcrypt.hash(password, 10);
//       }
  
//       const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
//         new: true,
//       });
  
//       if (!updatedUser) {
//         return res.status(404).json({ status: false, message: 'User not found' });
//       }
  
//       res.json({ status: true, message: 'User updated', data: updatedUser });
//     } catch (err) {
//       console.error('Update user error:', err);
//       res.status(500).json({ status: false, message: 'Failed to update user' });
//     }
//   };
  
const updateUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, password, role } = req.body;
  
      // Check if email is already in use by another user
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ status: false, message: 'Email already in use' });
        }
      }
  
      const updateData = { username, email, role };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });
  
      res.json({ status: true, message: 'User updated', data: updatedUser });
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({ status: false, message: 'Server error' });
    }
  };
  
  // Delete user by ID
  const deleteUserById = async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ status: false, message: 'User not found' });
      }
      res.json({ status: true, message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ status: false, message: 'Failed to delete user' });
    }
  };
  
  module.exports = {
    createUserByAdmin,
    getAllUsersCreateUserByAdmin,
    getUserByIdCreateUserByAdmin,
    updateUserById,
    deleteUserById
  };
  