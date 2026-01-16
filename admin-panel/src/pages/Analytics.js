import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaEye, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Analytics = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('likes'); // likes, views, comments, shares

  useEffect(() => {
    fetchBlogsAnalytics();
  }, []);

  const fetchBlogsAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/blogs/all');
      setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return (b.likesCount || 0) - (a.likesCount || 0);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'comments':
        return (b.commentsCount || 0) - (a.commentsCount || 0);
      case 'shares':
        return (b.shares || 0) - (a.shares || 0);
      default:
        return 0;
    }
  });

  const totalEngagement = {
    likes: blogs.reduce((sum, blog) => sum + (blog.likesCount || 0), 0),
    views: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
    comments: blogs.reduce((sum, blog) => sum + (blog.commentsCount || 0), 0),
    shares: blogs.reduce((sum, blog) => sum + (blog.shares || 0), 0),
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
          <h1><FaChartLine /> Blog Analytics</h1>
          <p>Track blog engagement and user interaction metrics</p>
        </div>
      </motion.div>

      {/* Overall Stats */}
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ borderLeft: '4px solid #ef4444' }}
        >
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Total Likes</span>
              <FaHeart style={{ color: '#ef4444' }} />
            </div>
            <h2>{totalEngagement.likes}</h2>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{ borderLeft: '4px solid #3b82f6' }}
        >
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Total Views</span>
              <FaEye style={{ color: '#3b82f6' }} />
            </div>
            <h2>{totalEngagement.views}</h2>
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
              <span className="stat-label">Total Comments</span>
              <FaComment style={{ color: '#10b981' }} />
            </div>
            <h2>{totalEngagement.comments}</h2>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{ borderLeft: '4px solid #8b5cf6' }}
        >
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Total Shares</span>
              <FaShare style={{ color: '#8b5cf6' }} />
            </div>
            <h2>{totalEngagement.shares}</h2>
          </div>
        </motion.div>
      </div>

      {/* Sort Controls */}
      <motion.div
        className="table-controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="filter-buttons">
          <span style={{ fontWeight: 600, marginRight: '1rem' }}>Sort by:</span>
          {['likes', 'views', 'comments', 'shares'].map(metric => (
            <button
              key={metric}
              className={`filter-btn ${sortBy === metric ? 'active' : ''}`}
              onClick={() => setSortBy(metric)}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Blog Analytics Table */}
      <motion.div
        className="data-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>Blog Title</th>
              <th>Author</th>
              <th>
                <FaHeart style={{ marginRight: '0.5rem' }} />
                Likes
              </th>
              <th>
                <FaEye style={{ marginRight: '0.5rem' }} />
                Views
              </th>
              <th>
                <FaComment style={{ marginRight: '0.5rem' }} />
                Comments
              </th>
              <th>
                <FaShare style={{ marginRight: '0.5rem' }} />
                Shares
              </th>
              <th>Engagement Rate</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {sortedBlogs.map((blog, index) => {
              const engagementRate = blog.views > 0
                ? (((blog.likesCount || 0) + (blog.commentsCount || 0) + (blog.shares || 0)) / blog.views * 100).toFixed(1)
                : 0;
              
              return (
                <motion.tr
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      <strong>{blog.title}</strong>
                      <br />
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {blog.category}
                      </span>
                    </div>
                  </td>
                  <td>{blog.authorName || 'Unknown'}</td>
                  <td>
                    <span className="metric-badge" style={{ background: '#fee2e2', color: '#ef4444' }}>
                      {blog.likesCount || 0}
                    </span>
                  </td>
                  <td>
                    <span className="metric-badge" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                      {blog.views || 0}
                    </span>
                  </td>
                  <td>
                    <span className="metric-badge" style={{ background: '#d1fae5', color: '#10b981' }}>
                      {blog.commentsCount || 0}
                    </span>
                  </td>
                  <td>
                    <span className="metric-badge" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                      {blog.shares || 0}
                    </span>
                  </td>
                  <td>
                    <strong>{engagementRate}%</strong>
                  </td>
                  <td>
                    {blog.published ? (
                      <span className="status-badge published">Published</span>
                    ) : (
                      <span className="status-badge draft">Draft</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {sortedBlogs.length === 0 && (
          <div className="no-data">
            <FaChartLine size={48} />
            <p>No blog analytics available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
