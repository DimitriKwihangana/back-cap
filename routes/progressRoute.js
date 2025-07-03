const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// POST /progress/complete-module

router.post('/complete-module', async (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ success: false, message: 'Missing userId or courseId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const course = user.courses.find(c => c.courseId.toString() === courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found in user' });
    }

    course.completed = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Course marked as completed' });
  } catch (error) {
    console.error('Error completing module:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
