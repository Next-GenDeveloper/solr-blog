import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaUser, FaEye, FaArrowLeft, FaHeart, FaComment, FaShare, FaTrash, FaFacebook, FaTwitter, FaLinkedin, FaCopy } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const { user, token } = useAuth();

  useEffect(() => {
    fetchBlog();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}`);
      setBlog(data.data);
      setLikesCount(data.data.likesCount || 0);
      setCommentsCount(data.data.commentsCount || 0);
      setSharesCount(data.data.shares || 0);
      
      // Check if current user has liked this blog
      if (user && data.data.likes) {
        setIsLiked(data.data.likes.includes(user._id));
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}/comments`);
      setComments(data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like this post');
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/blogs/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsLiked(data.liked);
      setLikesCount(data.likesCount);
      toast.success(data.liked ? 'Liked!' : 'Unliked');
    } catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Failed to like post');
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this blog post';
    const text = blog?.excerpt || blog?.title || '';

    try {
      // Increment share count
      await axios.post(`/api/blogs/${id}/share`);
      setSharesCount(prev => prev + 1);

      switch (platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank',
            'width=600,height=400'
          );
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            '_blank',
            'width=600,height=400'
          );
          break;
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank',
            'width=600,height=400'
          );
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
          return;
        default:
          break;
      }
      
      toast.success('Shared successfully!');
    } catch (error) {
      console.error('Error sharing blog:', error);
      toast.error('Failed to share post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/blogs/${id}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setComments([data.data, ...comments]);
      setCommentsCount(prev => prev + 1);
      setCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(
        `/api/blogs/${id}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setComments(comments.filter(c => c._id !== commentId));
      setCommentsCount(prev => Math.max(0, prev - 1));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (!blog) {
    return <div className="error-message">Blog post not found</div>;
  }

  return (
    <div className="blog-detail-page">
      <div className="container section-padding">
        <Link to="/blog" className="back-link">
          <FaArrowLeft /> Back to Blog
        </Link>

        <motion.article
          className="blog-article"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <header className="article-header">
            <span className="article-category">{blog.category}</span>
            <h1>{blog.title}</h1>
            
            <div className="article-meta">
              <span className="meta-item">
                <FaUser /> {blog.authorName}
              </span>
              <span className="meta-item">
                <FaClock /> {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="meta-item">
                <FaEye /> {blog.views} views
              </span>
            </div>
          </header>

          {blog.featuredImage && (
            <div className="article-image">
              <img src={blog.featuredImage} alt={blog.title} />
            </div>
          )}

          <div className="article-content">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="article-tags">
              <h4>Tags:</h4>
              <div className="tags-list">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Blog Interactions */}
          <div className="blog-interactions">
            <motion.button
              className={`interaction-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!user}
            >
              <FaHeart /> <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </motion.button>
            
            <button className="interaction-btn">
              <FaComment /> <span>{commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}</span>
            </button>
            
            <button className="interaction-btn">
              <FaShare /> <span>{sharesCount} {sharesCount === 1 ? 'Share' : 'Shares'}</span>
            </button>
          </div>

          {/* Social Share Section */}
          <div className="social-share-section">
            <h4>Share this article</h4>
            <div className="social-share-buttons">
              <motion.button
                className="social-btn facebook"
                onClick={() => handleShare('facebook')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFacebook /> Facebook
              </motion.button>
              <motion.button
                className="social-btn twitter"
                onClick={() => handleShare('twitter')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTwitter /> X (Twitter)
              </motion.button>
              <motion.button
                className="social-btn linkedin"
                onClick={() => handleShare('linkedin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin /> LinkedIn
              </motion.button>
              <motion.button
                className="social-btn copy"
                onClick={() => handleShare('copy')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCopy /> Copy Link
              </motion.button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3>Comments ({commentsCount})</h3>
            
            {user ? (
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="4"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="login-prompt">
                <p>Please <Link to="/login">login</Link> to comment on this post.</p>
              </div>
            )}

            <div className="comments-list">
              <AnimatePresence>
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment._id}
                    className="comment-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="comment-header">
                      <div className="comment-author">
                        <FaUser className="comment-icon" />
                        <span className="author-name">{comment.userName}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {user && (user._id === comment.user || user.role === 'admin') && (
                        <button
                          className="delete-comment-btn"
                          onClick={() => handleDeleteComment(comment._id)}
                          title="Delete comment"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {comments.length === 0 && (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail;
