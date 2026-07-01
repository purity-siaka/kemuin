const Group = require('../models/Group');
const GroupPost = require('../models/GroupPost');

// Create group
const createGroup = async (req, res) => {
  try {
    const { name, description, category, privacy } = req.body;

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group with this name already exists' });
    }

    const group = new Group({
      name,
      description,
      category,
      privacy,
      admin: req.userId,
      members: [{ userId: req.userId, role: 'admin' }],
      memberCount: 1
    });

    await group.save();
    res.status(201).json({ message: 'Group created', group });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create group', error: error.message });
  }
};

// Get all groups
const getGroups = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isActive: true, privacy: 'public' };
    if (category) filter.category = category;

    const groups = await Group.find(filter)
      .populate('admin', 'firstName lastName profilePhoto')
      .sort({ memberCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Group.countDocuments(filter);

    res.json({
      groups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups', error: error.message });
  }
};

// Get group by ID
const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('admin', 'firstName lastName profilePhoto')
      .populate('members.userId', 'firstName lastName profilePhoto')
      .populate({
        path: 'posts',
        populate: { path: 'author', select: 'firstName lastName profilePhoto' }
      });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group', error: error.message });
  }
};

// Join group
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(
      (member) => member.userId.toString() === req.userId.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    group.members.push({ userId: req.userId, role: 'member' });
    group.memberCount = group.members.length;
    await group.save();

    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join group', error: error.message });
  }
};

// Leave group
const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members = group.members.filter(
      (member) => member.userId.toString() !== req.userId.toString()
    );
    group.memberCount = group.members.length;
    await group.save();

    res.json({ message: 'Left group successfully', group });
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave group', error: error.message });
  }
};

// Create group post
const createGroupPost = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, images, videos } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check membership
    const isMember = group.members.some(
      (member) => member.userId.toString() === req.userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You must be a member to post in this group' });
    }

    const post = new GroupPost({
      group: groupId,
      author: req.userId,
      content,
      images: images || [],
      videos: videos || []
    });

    await post.save();
    await post.populate('author', 'firstName lastName profilePhoto');

    group.posts.push(post._id);
    await group.save();

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create group post', error: error.message });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  createGroupPost
};
