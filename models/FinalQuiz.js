const mongoose = require('mongoose');

const finalQuizSchema = new mongoose.Schema({
  title:{
    type: String,
    required: [true, 'Quiz title is required'],
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  attempts: {
    type: Number,
    default: 1,
    min: 1,
  },
  questions: [
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: [{ type: String, required: true }],
    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  }
],
  completedAt: {
    type: Date,
    default: Date.now,
  },
  certificateIssued: {
    type: Boolean,
    default: false, 
  }
}, { timestamps: true });

module.exports = mongoose.model('FinalQuiz', finalQuizSchema);
