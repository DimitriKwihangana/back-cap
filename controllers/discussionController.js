const Discussion = require('../models/Discussion');

// exports.createDiscussion = async (req, res) => {
//   try {
//     const {
//       title,
//       body,
//       moduleId,
//       moduleName,
//       submoduleId,
//       submoduleName,
//       userId,
//       createdAt,
//     } = req.body;

//     if (!title || !body || !moduleId || !submoduleId) {
//       return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
//     }

//     const discussion = new Discussion({
//   title,
//   body,
//   courseId,
//   courseName,
//   moduleId,
//   moduleName,
//   submoduleId,
//   submoduleName,
//   userId,
//   createdAt: createdAt || new Date(),
// });


//     const savedDiscussion = await discussion.save();

//     res.status(201).json({ status: 'success', data: savedDiscussion });
//   } catch (error) {
//     console.error('Create error:', error);
//     res.status(500).json({ status: 'error', message: 'Server error while creating discussion' });
//   }
// };

exports.createDiscussion = async (req, res) => {
  try {
    const {
      title,
      body,
      courseId,
      courseName, // if needed
      moduleId,
      moduleName,
      submoduleId,
      submoduleName,
      userId,
      createdAt,
    } = req.body;

    if (!title || !body || !moduleId || !submoduleId || !courseId) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const discussion = new Discussion({
      title,
      body,
      courseId,
      courseName, 
      moduleId,
      moduleName,
      submoduleId,
      submoduleName,
      userId: userId,
      createdAt: createdAt || new Date(),
    });

    const savedDiscussion = await discussion.save();
    res.status(201).json({ status: 'success', data: savedDiscussion });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ status: 'error', message: 'Server error while creating discussion' });
  }
};


exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 }).populate('userId', 'name email')  // populate user name and email only
    res.status(200).json({ status: 'success', data: discussions });
  } catch (error) {
    console.error('Get all error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch discussions' });
  }
};

exports.getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ status: 'fail', message: 'Discussion not found' });
    }
    res.status(200).json({ status: 'success', data: discussion });
  } catch (error) {
    console.error('Get by ID error:', error);
    res.status(500).json({ status: 'error', message: 'Error retrieving discussion' });
  }
};


exports.updateDiscussionById = async (req, res) => {
  try {
    const updated = await Discussion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ status: 'fail', message: 'Discussion not found' });
    }

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ status: 'error', message: 'Error updating discussion' });
  }
};

exports.deleteDiscussionById = async (req, res) => {
  try {
    const deleted = await Discussion.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ status: 'fail', message: 'Discussion not found' });
    }

    res.status(200).json({ status: 'success', message: 'Discussion deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ status: 'error', message: 'Error deleting discussion' });
  }
};
