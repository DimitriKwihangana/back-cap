const express = require('express');
const DiscussionRouter = express.Router();
const discussionController = require('../controllers/discussionController');

DiscussionRouter.post('/', discussionController.createDiscussion);
DiscussionRouter.get('/', discussionController.getAllDiscussions);
DiscussionRouter.get('/:id', discussionController.getDiscussionById);
DiscussionRouter.put('/:id', discussionController.updateDiscussionById);
DiscussionRouter.delete('/:id', discussionController.deleteDiscussionById);

module.exports = DiscussionRouter;
