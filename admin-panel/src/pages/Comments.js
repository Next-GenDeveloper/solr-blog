import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaComment, FaCheck, FaTimes, FaTrash, FaClock, FaUser, FaBlog,
  FaSearch, FaFilter, FaChartBar, FaCalendarAlt, FaEye, FaSortAmountDown
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/comments');
      setComments(data.data || []);
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
        comment.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.blog?.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
        {badge.icon} {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // Statistics
  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    rejected: comments.filter(c => c.status === 'rejected').length,
  };

  // Chart data for comments over time
  const getCommentsOverTime = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayComments = comments.filter(c => {
        const commentDate = new Date(c.createdAt);
        return commentDate.toDateString() === date.toDateString();
      }).length;
      last7Days.push({ name: dateStr, comments: dayComments });
    }
    return last7Days;
  };

  // Pie chart data
  const pieData = [
    { name: 'Approved', value: stats.approved, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page comments-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <div>
          <h1><FaComment style={{ marginRight: '0.75rem' }} /> Comments Management</h1>
          <p>Review, moderate, and manage all blog comments</p>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-text">Pending Review</span>
          </div>
        </div>
      </motion.div>

      {/* Analytics Section */}
      <div className="analytics-grid">
        {/* Stats Cards */}
        <motion.div
          className="stat-card modern-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <FaComment />
          </div>
          <div className="stat-details">
            <h3>{stats.total}</h3>
            <p>Total Comments</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card modern-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
            <FaClock />
          </div>
          <div className="stat-details">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card modern-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <FaCheck />
          </div>
          <div className="stat-details">
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card modern-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <FaTimes />
          </div>
          <div className="stat-details">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <h3><FaChartBar style={{ marginRight: '0.5rem' }} /> Comments Trend (Last 7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={getCommentsOverTime()}>
              <defs>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.5} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
              <Area type="monotone" dataKey="comments" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorComments)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card pie-chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="chart-header">
            <h3><FaFilter style={{ marginRight: '0.5rem' }} /> Status Distribution</h3>
          </div>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {pieData.map((entry, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ background: entry.color }}></span>
                  <span className="legend-label">{entry.name}</span>
                  <span className="legend-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        className="table-controls enhanced-controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="controls-left">
          <div className="filter-buttons">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status === 'all' && <FaSortAmountDown style={{ marginRight: '0.5rem' }} />}
                {status === 'pending' && <FaClock style={{ marginRight: '0.5rem' }} />}
                {status === 'approved' && <FaCheck style={{ marginRight: '0.5rem' }} />}
                {status === 'rejected' && <FaTimes style={{ marginRight: '0.5rem' }} />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="filter-count">
                    {status === 'pending' ? stats.pending : status === 'approved' ? stats.approved : stats.rejected}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="search-box enhanced-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search comments, users, or blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Comments List */}
      <motion.div
        className="comments-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {filteredComments.length > 0 ? (
          <div className="comments-grid">
            <AnimatePresence>
              {filteredComments.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  className={`comment-card enhanced ${comment.status}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className="comment-card-header">
                    <div className="comment-author">
                      <div className="author-avatar">
                        {comment.userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="author-info">
                        <span className="author-name">{comment.userName || 'Unknown User'}</span>
                        <span className="comment-time">
                          <FaCalendarAlt style={{ marginRight: '4px' }} />
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(comment.status)}
                  </div>

                  <div className="comment-blog-info">
                    <FaBlog style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                    <span>{comment.blog?.title || 'Unknown Blog'}</span>
                  </div>

                  <div className="comment-content">
                    <p>{comment.text}</p>
                  </div>

                  <div className="comment-card-footer">
                    <button 
                      className="action-link"
                      onClick={() => {
                        setSelectedComment(comment);
                        setShowDetailModal(true);
                      }}
                    >
                      <FaEye /> View Details
                    </button>
                    <div className="comment-actions">
                      {comment.status !== 'approved' && (
                        <motion.button
                          className="btn-icon btn-success"
                          onClick={() => handleApprove(comment._id)}
                          title="Approve"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaCheck />
                        </motion.button>
                      )}
                      {comment.status !== 'rejected' && (
                        <motion.button
                          className="btn-icon btn-warning"
                          onClick={() => handleReject(comment._id)}
                          title="Reject"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaTimes />
                        </motion.button>
                      )}
                      <motion.button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(comment._id)}
                        title="Delete"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="no-data-container">
            <div className="no-data-icon">
              <FaComment />
            </div>
            <h3>No Comments Found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms' : 'There are no comments to display'}</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedComment && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="modal-content comment-detail-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Comment Details</h2>
                <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <label>Status</label>
                  {getStatusBadge(selectedComment.status)}
                </div>
                <div className="detail-section">
                  <label>Author</label>
                  <div className="detail-author">
                    <div className="author-avatar large">
                      {selectedComment.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{selectedComment.userName || 'Unknown User'}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <label>Blog Post</label>
                  <p className="detail-blog">{selectedComment.blog?.title || 'Unknown Blog'}</p>
                </div>
                <div className="detail-section">
                  <label>Comment</label>
                  <div className="detail-comment-text">
                    {selectedComment.text}
                  </div>
                </div>
                <div className="detail-section">
                  <label>Posted On</label>
                  <p>{new Date(selectedComment.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="modal-footer">
                {selectedComment.status !== 'approved' && (
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      handleApprove(selectedComment._id);
                      setShowDetailModal(false);
                    }}
                  >
                    <FaCheck style={{ marginRight: '0.5rem' }} /> Approve
                  </button>
                )}
                {selectedComment.status !== 'rejected' && (
                  <button 
                    className="btn-secondary btn-warning-outline"
                    onClick={() => {
                      handleReject(selectedComment._id);
                      setShowDetailModal(false);
                    }}
                  >
                    <FaTimes style={{ marginRight: '0.5rem' }} /> Reject
                  </button>
                )}
                <button 
                  className="btn-secondary btn-danger-outline"
                  onClick={() => {
                    handleDelete(selectedComment._id);
                    setShowDetailModal(false);
                  }}
                >
                  <FaTrash style={{ marginRight: '0.5rem' }} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Comments;
