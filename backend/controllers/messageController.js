const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');

// Get conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId
    })
      .populate('participants', 'firstName lastName profilePhoto')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch conversations', error: error.message });
  }
};

// Get conversation messages
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ conversation: conversationId });

    res.json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, attachments } = req.body;

    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: 'Message content or attachments required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Not a participant in this conversation' });
    }

    const message = new Message({
      conversation: conversationId,
      sender: req.userId,
      content,
      attachments: attachments || []
    });

    await message.save();
    await message.populate('sender', 'firstName lastName profilePhoto');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Send notification to other participants
    const otherParticipants = conversation.participants.filter(
      (p) => p.toString() !== req.userId.toString()
    );

    for (const participantId of otherParticipants) {
      const notification = new Notification({
        recipient: participantId,
        sender: req.userId,
        type: 'message',
        title: 'New message',
        relatedEntity: {
          entityType: 'Message',
          entityId: message._id
        }
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// Start new conversation
const startConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (participantId === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot start conversation with yourself' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, participantId] },
      isGroupConversation: false
    });

    if (conversation) {
      return res.json({ message: 'Conversation already exists', conversation });
    }

    // Create new conversation
    conversation = new Conversation({
      participants: [req.userId, participantId],
      isGroupConversation: false
    });

    await conversation.save();
    await conversation.populate('participants', 'firstName lastName profilePhoto');

    res.status(201).json({ message: 'Conversation started', conversation });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start conversation', error: error.message });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const alreadyRead = message.readBy.some(
      (read) => read.userId.toString() === req.userId.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({ userId: req.userId });
      await message.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark message as read', error: error.message });
  }
};

module.exports = {
  getConversations,
  getConversationMessages,
  sendMessage,
  startConversation,
  markAsRead
};
