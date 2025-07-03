const express = require('express');
const LessonRouter = express.Router()
const LessonController = require('../controllers/LessonController');

LessonRouter.post('/api/courses/:courseId/modules/:moduleId/submodules/:submoduleId/lessons', LessonController.addLesson);
LessonRouter.put('/api/courses/:courseId/modules/:moduleId/submodules/:submoduleId/lessons/:lessonId', LessonController.updateLesson);
LessonRouter.delete('/api/courses/:courseId/modules/:moduleId/submodules/:submoduleId/lessons/:lessonId', LessonController.deleteLesson);


module.exports = LessonRouter;