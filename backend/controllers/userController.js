const User = require('../models/User');
const Notification = require('../models/Notification');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'firstName lastName profilePhoto')
      .populate('following', 'firstName lastName profilePhoto');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, headline, location, website, jobTitle, company } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        bio,
        headline,
        location,
        website,
        jobTitle,
        company,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};

// Upload profile photo
const uploadProfilePhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePhoto: photoUrl },
      { new: true }
    );

    res.json({ message: 'Profile photo updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// Add connection/friend
const addConnection = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.userId.toString() === userId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const user = await User.findById(req.userId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already connected or request pending
    const existingConnection = user.connections.find(
      (conn) => conn.userId.toString() === userId
    );

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists or pending' });
    }

    // Add connection request
    user.connections.push({
      userId,
      status: 'pending'
    });

    await user.save();

    // Create notification
    const notification = new Notification({
      recipient: userId,
      sender: req.userId,
      type: 'connection_request',
      title: `${user.firstName} ${user.lastName} sent you a connection request`,
      relatedEntity: {
        entityType: 'User',
        entityId: req.userId
      }
    });

    await notification.save();

    res.json({ message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add connection', error: error.message });
  }
};

// Accept/Reject connection
const respondToConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'accepted' or 'blocked'

    const user = await User.findById(req.userId);
    const requesterUser = await User.findById(userId);

    if (!requesterUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update requester's connection
    const requesterConnection = requesterUser.connections.find(
      (conn) => conn.userId.toString() === req.userId.toString()
    );

    if (!requesterConnection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    requesterConnection.status = status;

    if (status === 'accepted') {
      requesterConnection.connectedAt = new Date();
      
      // Add connection for current user
      user.connections.push({
        userId,
        status: 'accepted',
        connectedAt: new Date()
      });

      // Create notification
      const notification = new Notification({
        recipient: userId,
        sender: req.userId,
        type: 'connection_accepted',
        title: `${user.firstName} ${user.lastName} accepted your connection request`,
        relatedEntity: {
          entityType: 'User',
          entityId: req.userId
        }
      });

      await notification.save();
    }

    await requesterUser.save();
    await user.save();

    res.json({ message: `Connection ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to respond to connection', error: error.message });
  }
};

// Get connections
const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      'connections.userId',
      'firstName lastName profilePhoto headline'
    );

    const acceptedConnections = user.connections.filter(
      (conn) => conn.status === 'accepted'
    );

    res.json({
      connections: acceptedConnections,
      count: acceptedConnections.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch connections', error: error.message });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { headline: { $regex: q, $options: 'i' } }
      ]
    })
      .select('firstName lastName profilePhoto headline company department')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  addConnection,
  respondToConnection,
  getConnections,
  searchUsers
};
