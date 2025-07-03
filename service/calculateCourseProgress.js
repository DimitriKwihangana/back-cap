const User = require('../models/User');
const Course = require('../models/Course');

const calculateCourseProgress = (user, courseId) => {
    // Find the course the user is enrolled in
    const course = user.courses.find(course => course.courseId.toString() === courseId.toString());

    if (!course) {
      return 0;  // If the user is not enrolled in the course, progress is 0%
    }

    let totalLessons = 0;
    let completedLessons = 0;

    course.completedModules.forEach(module => {
      module.completedLessons.forEach(lesson => {
        totalLessons++;
        if (lesson.completedAt) {
          completedLessons++;
        }
      });
    });

    // Calculate progress as a percentage
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return progress;  // Returns a value between 0 and 100
};

module.exports = {
    calculateCourseProgress
};
