const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-callback', authController.googleCallback);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', auth, authController.logout);

router.get('/admin/pending', auth, auth.requireAdmin, authController.getPendingUsers);
router.get('/admin/users', auth, auth.requireAdmin, authController.getAllUsers);
router.put('/admin/users/:userId/approve', auth, auth.requireAdmin, authController.approveUser);
router.put('/admin/users/:userId/reject', auth, auth.requireAdmin, authController.rejectUser);

module.exports = router;
