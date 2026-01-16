import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaCheck, FaTimes, FaTrash, FaClock, FaUser, FaBlog } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/comments');
      setComments(data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/comments/${id}/approve`);
      toast.success('Comment approved successfully');
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Failed to approve comment');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/comments/${id}/reject`);
      toast.success('Comment rejected successfully');
      fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast.error('Failed to reject comment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`/api/comments/${id}`);
      toast.success('Comment deleted successfully');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const filteredComments = comments
    .filter(comment => {
      if (filter === 'all') return true;
      return comment.status === filter;
    })
    .filter(comment => {
      if (!searchTerm) return true;
      return (
        comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.blog?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: '#f59e0b', bg: '#fef3c7', icon: <FaClock /> },
      approved: { color: '#10b981', bg: '#d1fae5', icon: <FaCheck /> },
      rejected: { color: '#ef4444', bg: '#fee2e2', icon: <FaTimes /> },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span 
        className="status-badge" 
        style={{ color: badge.color, backgroundColor: badge.bg }}
      >
        {badge.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    rejected: comments.filter(c => c.status === 'rejected').length,
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <div>
          <h1><FaComment /> Comments Management</h1>
          <p>Review, approve, or delete blog comments</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ borderLeft: '4px solid #6366f1' }}
        >
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Total Comments</span>
              <FaComment style={{ color: '#6366f1' }} />
            </div>
            <h2>{stats.total}</h2>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{ borderLeft: '4px solid #f59e0b' }}
        >
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Pending</span>
              <FaClock style={{ color: '#f59e0b' }} />
            </div>
            <h2>{stats.pending}</h2>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ borderLeft: '4px solid #10b981' }}
        >
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Approved</span>
              <FaCheck style={{ color: '#10b981' }} />
            </div>
            <h2>{stats.approved}</h2>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{ borderLeft: '4px solid #ef4444' }}
        >
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Rejected</span>
              <FaTimes style={{ color: '#ef4444' }} />
            </div>
            <h2>{stats.rejected}</h2>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        className="table-controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="filter-buttons">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Comments List */}
      <motion.div
        className="data-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredComments.length > 0 ? (
          <div className="comments-list">
            <AnimatePresence>
              {filteredComments.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  className="comment-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="comment-header">
                    <div className="comment-meta">
                      <div className="comment-user">
                        <FaUser />
                        <span className="user-name">{comment.userName}</span>
                      </div>
                      <div className="comment-blog">
                        <FaBlog />
                        <span className="blog-title">{comment.blog?.title || 'Unknown Blog'}</span>
                      </div>
                    </div>
                    <div className="comment-status">
                      {getStatusBadge(comment.status)}
                    </div>
                  </div>

                  <div className="comment-body">
                    <p className="comment-text">{comment.text}</p>
                  </div>

                  <div className="comment-footer">
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    <div className="comment-actions">
                      {comment.status !== 'approved' && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleApprove(comment._id)}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {comment.status !== 'rejected' && (
                        <button
                          className="btn-icon btn-warning"
                          onClick={() => handleReject(comment._id)}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(comment._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="no-data">
            <FaComment size={48} />
            <p>No comments found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Comments;
