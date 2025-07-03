const Course = require('../models/Course')

exports.addLesson = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
  
      const module = course.modules.id(req.params.moduleId);
      if (!module) return res.status(404).json({ message: 'Module not found' });
  
      const submodule = module.submodules.id(req.params.submoduleId);
      if (!submodule) return res.status(404).json({ message: 'Submodule not found' });
  
      submodule.lessons.push(req.body);
      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a lesson
  exports.updateLesson = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
  
      const module = course.modules.id(req.params.moduleId);
      if (!module) return res.status(404).json({ message: 'Module not found' });
  
      const submodule = module.submodules.id(req.params.submoduleId);
      if (!submodule) return res.status(404).json({ message: 'Submodule not found' });
  
      const lesson = submodule.lessons.id(req.params.lessonId);
      if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  
      Object.assign(lesson, req.body);
      await course.save();
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.deleteLesson = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
  
      const module = course.modules.id(req.params.moduleId);
      if (!module) return res.status(404).json({ message: 'Module not found' });
  
      const submodule = module.submodules.id(req.params.submoduleId);
      if (!submodule) return res.status(404).json({ message: 'Submodule not found' });
  
      submodule.lessons.id(req.params.lessonId).remove();
      await course.save();
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  