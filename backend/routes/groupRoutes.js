const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

// Group routes
router.post('/', auth, groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/:groupId', groupController.getGroup);
router.post('/:groupId/join', auth, groupController.joinGroup);
router.post('/:groupId/leave', auth, groupController.leaveGroup);
router.post('/:groupId/posts', auth, groupController.createGroupPost);

module.exports = router;
