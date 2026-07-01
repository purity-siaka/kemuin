const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// Create post
const createPost = async (req, res) => {
  try {
    const { content, images, visibility } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = new Post({
      author: req.userId,
      content,
      images: images || [],
      visibility: visibility || 'public',
      isPublished: true
    });

    await post.save();
    await post.populate('author', 'firstName lastName profilePhoto headline');

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Get news feed
const getNewsFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublished: true, visibility: 'public' })
      .populate('author', 'firstName lastName profilePhoto headline company')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'firstName lastName profilePhoto' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({ isPublished: true, visibility: 'public' });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news feed', error: error.message });
  }
};

// Like post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.some(
      (like) => like.userId.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter((like) => like.userId.toString() !== req.userId.toString());
    } else {
      post.likes.push({ userId: req.userId });

      // Create notification
      if (post.author.toString() !== req.userId.toString()) {
        const notification = new Notification({
          recipient: post.author,
          sender: req.userId,
          type: 'post_like',
          title: 'Someone liked your post',
          relatedEntity: {
            entityType: 'Post',
            entityId: postId
          }
        });
        await notification.save();
      }
    }

    await post.save();
    res.json({ message: alreadyLiked ? 'Post unliked' : 'Post liked', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
};

// Comment on post
const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      post: postId,
      author: req.userId,
      content
    });

    await comment.save();
    await comment.populate('author', 'firstName lastName profilePhoto');

    post.comments.push(comment._id);
    await post.save();

    // Create notification
    if (post.author.toString() !== req.userId.toString()) {
      const notification = new Notification({
        recipient: post.author,
        sender: req.userId,
        type: 'post_comment',
        title: 'Someone commented on your post',
        relatedEntity: {
          entityType: 'Post',
          entityId: postId
        }
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};

// Get post by ID
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'firstName lastName profilePhoto headline company')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'firstName lastName profilePhoto' }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: req.params.postId });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

module.exports = {
  createPost,
  getNewsFeed,
  likePost,
  commentOnPost,
  getPost,
  deletePost
};
