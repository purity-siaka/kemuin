const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');

// Post routes
router.post('/', auth, postController.createPost);
router.get('/feed', postController.getNewsFeed);
router.get('/:postId', postController.getPost);
router.post('/:postId/like', auth, postController.likePost);
router.post('/:postId/comment', auth, postController.commentOnPost);
router.delete('/:postId', auth, postController.deletePost);

module.exports = router;
