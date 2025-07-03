const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Discussion title is required'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Discussion body is required'],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  courseName: {
    type: String,
    required: true
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  submoduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submodule',
    required: true,
  },
  submoduleName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
