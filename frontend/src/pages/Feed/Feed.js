import React, { useState, useEffect } from 'react';
import { postService } from '../../services/api';
import '../../styles/Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await postService.getNewsFeed(page, 10);
      if (page === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts([...posts, ...response.data.posts]);
      }
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await postService.createPost({ content });
      setPosts([response.data.post, ...posts]);
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      fetchFeed();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <div className="feed-container">
      <div className="post-composer">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows="3"
          />
          <button type="submit" disabled={!content.trim()}>
            Post
          </button>
        </form>
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <img src={post.author.profilePhoto} alt={post.author.firstName} />
              <div>
                <h4>{post.author.firstName} {post.author.lastName}</h4>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}>
                👍 Like ({post.likes.length})
              </button>
              <button>💬 Comment ({post.comments.length})</button>
              <button>📤 Share</button>
            </div>
          </div>
        ))}
      </div>

      {!loading && (
        <button onClick={() => setPage(page + 1)} className="load-more">
          Load More
        </button>
      )}
    </div>
  );
};

export default Feed;
