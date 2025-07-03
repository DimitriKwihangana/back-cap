const mongoose = require('mongoose');
const SubModule = require('./CourseSubModuleSchema');
const QuizSchema = require('./QuizSchema');

const CourseModule = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: { type: String },
    submodules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubModule'
        }
    ],
    quiz: {
        type: QuizSchema,
        required: false
    }
});

module.exports = mongoose.model('CourseModule', CourseModule);