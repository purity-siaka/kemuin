const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// User routes
router.get('/profile/:userId', userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/profile/photo', auth, userController.uploadProfilePhoto);
router.post('/connections/add/:userId', auth, userController.addConnection);
router.post('/connections/respond/:userId', auth, userController.respondToConnection);
router.get('/connections/:userId', userController.getConnections);
router.get('/search', userController.searchUsers);

module.exports = router;
