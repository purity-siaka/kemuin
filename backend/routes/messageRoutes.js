const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// Message routes
router.get('/conversations', auth, messageController.getConversations);
router.post('/conversations/start', auth, messageController.startConversation);
router.get('/conversations/:conversationId/messages', auth, messageController.getConversationMessages);
router.post('/conversations/:conversationId/messages', auth, messageController.sendMessage);
router.post('/messages/:messageId/read', auth, messageController.markAsRead);

module.exports = router;
