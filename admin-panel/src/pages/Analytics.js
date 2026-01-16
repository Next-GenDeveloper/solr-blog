import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHeart, FaComment, FaShare, FaEye, FaChartLine, FaChartBar,
  FaArrowUp, FaArrowDown, FaTrophy, FaFire, FaBolt, FaNewspaper, 
  FaFilter, FaDownload, FaChartPie, FaTags
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Analytics = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('views');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBlogsAnalytics();
  }, []);

  const fetchBlogsAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/blogs/all');
      setBlogs(data.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total metrics
  const totalEngagement = {
    likes: blogs.reduce((sum, blog) => sum + (blog.likesCount || 0), 0),
    views: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
    comments: blogs.reduce((sum, blog) => sum + (blog.commentsCount || 0), 0),
    shares: blogs.reduce((sum, blog) => sum + (blog.shares || 0), 0),
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter(b => b.published).length,
  };

  // Calculate average engagement rate
  const avgEngagementRate = totalEngagement.views > 0
    ? ((totalEngagement.likes + totalEngagement.comments + totalEngagement.shares) / totalEngagement.views * 100).toFixed(1)
    : 0;

  // Sort blogs
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
      case 'engagement':
        const engA = (a.views || 1) > 0 ? ((a.likesCount || 0) + (a.commentsCount || 0)) / (a.views || 1) : 0;
        const engB = (b.views || 1) > 0 ? ((b.likesCount || 0) + (b.commentsCount || 0)) / (b.views || 1) : 0;
        return engB - engA;
      default:
        return 0;
    }
  });

  // Category distribution data
  const categoryData = blogs.reduce((acc, blog) => {
    const category = blog.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / blogs.length) * 100).toFixed(1)
  }));

  // Engagement by category
  const engagementByCategory = blogs.reduce((acc, blog) => {
    const category = blog.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { views: 0, likes: 0, comments: 0, count: 0 };
    }
    acc[category].views += blog.views || 0;
    acc[category].likes += blog.likesCount || 0;
    acc[category].comments += blog.commentsCount || 0;
    acc[category].count += 1;
    return acc;
  }, {});

  const engagementChartData = Object.entries(engagementByCategory).map(([name, data]) => ({
    name,
    views: data.views,
    likes: data.likes,
    comments: data.comments,
    avgViews: Math.round(data.views / data.count),
  }));

  // Trend data (simulated for visualization)
  const trendData = selectedPeriod === '7days' 
    ? [
        { name: 'Mon', views: 120, likes: 45, comments: 12 },
        { name: 'Tue', views: 180, likes: 68, comments: 18 },
        { name: 'Wed', views: 150, likes: 52, comments: 15 },
        { name: 'Thu', views: 220, likes: 89, comments: 24 },
        { name: 'Fri', views: 280, likes: 112, comments: 32 },
        { name: 'Sat', views: 200, likes: 85, comments: 22 },
        { name: 'Sun', views: 160, likes: 72, comments: 19 },
      ]
    : selectedPeriod === '30days'
    ? [
        { name: 'Week 1', views: 850, likes: 320, comments: 95 },
        { name: 'Week 2', views: 1200, likes: 450, comments: 128 },
        { name: 'Week 3', views: 980, likes: 380, comments: 102 },
        { name: 'Week 4', views: 1450, likes: 520, comments: 156 },
      ]
    : [
        { name: 'Jan', views: 2400, likes: 920, comments: 245 },
        { name: 'Feb', views: 3200, likes: 1180, comments: 312 },
        { name: 'Mar', views: 2800, likes: 1050, comments: 278 },
        { name: 'Apr', views: 3600, likes: 1350, comments: 356 },
        { name: 'May', views: 4200, likes: 1580, comments: 412 },
        { name: 'Jun', views: 3800, likes: 1420, comments: 378 },
      ];

  // Colors for charts
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Views',
      value: totalEngagement.views.toLocaleString(),
      icon: <FaEye />,
      color: '#3b82f6',
      bgColor: '#dbeafe',
      trend: '+18.2%',
      trendUp: true,
      subtitle: 'All time page views'
    },
    {
      title: 'Total Likes',
      value: totalEngagement.likes.toLocaleString(),
      icon: <FaHeart />,
      color: '#ef4444',
      bgColor: '#fee2e2',
      trend: '+12.5%',
      trendUp: true,
      subtitle: 'User reactions'
    },
    {
      title: 'Comments',
      value: totalEngagement.comments.toLocaleString(),
      icon: <FaComment />,
      color: '#10b981',
      bgColor: '#d1fae5',
      trend: '+8.4%',
      trendUp: true,
      subtitle: 'User discussions'
    },
    {
      title: 'Shares',
      value: totalEngagement.shares.toLocaleString(),
      icon: <FaShare />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      trend: '+24.1%',
      trendUp: true,
      subtitle: 'Social reach'
    },
    {
      title: 'Engagement Rate',
      value: `${avgEngagementRate}%`,
      icon: <FaChartLine />,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      trend: '+5.2%',
      trendUp: true,
      subtitle: 'Avg interaction rate'
    },
    {
      title: 'Published Blogs',
      value: `${totalEngagement.publishedBlogs}/${totalEngagement.totalBlogs}`,
      icon: <FaNewspaper />,
      color: '#06b6d4',
      bgColor: '#cffafe',
      trend: `${((totalEngagement.publishedBlogs / (totalEngagement.totalBlogs || 1)) * 100).toFixed(0)}%`,
      trendUp: true,
      subtitle: 'Publication rate'
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="analytics-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="analytics-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="analytics-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="analytics-header">
        <div className="analytics-header-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="analytics-title-row">
              <div className="analytics-icon-box">
                <FaChartLine />
              </div>
              <div>
                <h1>Blog Analytics</h1>
                <p>Track performance, engagement, and growth metrics for your blog content</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="analytics-header-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="period-selector">
              {['7days', '30days', '6months'].map(period => (
                <button
                  key={period}
                  className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period === '7days' ? '7 Days' : period === '30days' ? '30 Days' : '6 Months'}
                </button>
              ))}
            </div>
            <button className="btn-export">
              <FaDownload /> Export Report
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-stats-grid">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="analytics-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' }}
          >
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                {stat.icon}
              </div>
              <div className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                {stat.trendUp ? <FaArrowUp /> : <FaArrowDown />}
                {stat.trend}
              </div>
            </div>
            <div className="stat-card-body">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <span className="stat-subtitle">{stat.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <motion.div 
        className="analytics-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
          { id: 'performance', label: 'Performance', icon: <FaTrophy /> },
          { id: 'categories', label: 'Categories', icon: <FaTags /> },
          { id: 'top-posts', label: 'Top Posts', icon: <FaFire /> },
        ].map(tab => (
          <button
            key={tab.id}
            className={`analytics-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="analytics-content"
          >
            {/* Charts Row */}
            <div className="analytics-charts-row">
              {/* Main Trend Chart */}
              <motion.div 
                className="analytics-chart-card large"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="chart-card-header">
                  <div>
                    <h3><FaChartLine /> Engagement Trends</h3>
                    <p>Views, likes, and comments over time</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Views" />
                    <Area type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLikes)" name="Likes" />
                    <Area type="monotone" dataKey="comments" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorComments)" name="Comments" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Category Distribution */}
              <motion.div 
                className="analytics-chart-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="chart-card-header">
                  <div>
                    <h3><FaChartPie /> Category Distribution</h3>
                    <p>Posts by category</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="category-legend">
                  {categoryChartData.slice(0, 5).map((cat, index) => (
                    <div key={cat.name} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="legend-label">{cat.name}</span>
                      <span className="legend-value">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Engagement by Category Bar Chart */}
            <motion.div 
              className="analytics-chart-card full-width"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="chart-card-header">
                <div>
                  <h3><FaChartBar /> Engagement by Category</h3>
                  <p>Compare views, likes, and comments across categories</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Views" />
                  <Bar dataKey="likes" fill="#ef4444" radius={[4, 4, 0, 0]} name="Likes" />
                  <Bar dataKey="comments" fill="#10b981" radius={[4, 4, 0, 0]} name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="analytics-content"
          >
            <div className="performance-grid">
              {/* Performance Score Card */}
              <motion.div 
                className="performance-score-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="score-header">
                  <FaTrophy className="score-icon" />
                  <h3>Overall Performance Score</h3>
                </div>
                <div className="score-display">
                  <div className="score-circle">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="url(#scoreGradient)" 
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${avgEngagementRate * 2.83} 283`}
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="score-value">
                      <span>{avgEngagementRate}</span>
                      <small>%</small>
                    </div>
                  </div>
                  <p className="score-label">Engagement Rate</p>
                </div>
                <div className="score-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Views to Engagement</span>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: `${Math.min(avgEngagementRate * 5, 100)}%`, backgroundColor: '#6366f1' }}></div>
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Content Quality</span>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: '78%', backgroundColor: '#10b981' }}></div>
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">User Retention</span>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: '65%', backgroundColor: '#f59e0b' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Key Metrics */}
              <div className="key-metrics-grid">
                <motion.div 
                  className="key-metric-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="key-metric-icon" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
                    <FaEye />
                  </div>
                  <div className="key-metric-info">
                    <span className="key-metric-value">{(totalEngagement.views / (totalEngagement.totalBlogs || 1)).toFixed(0)}</span>
                    <span className="key-metric-label">Avg Views/Post</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="key-metric-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="key-metric-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                    <FaHeart />
                  </div>
                  <div className="key-metric-info">
                    <span className="key-metric-value">{(totalEngagement.likes / (totalEngagement.totalBlogs || 1)).toFixed(0)}</span>
                    <span className="key-metric-label">Avg Likes/Post</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="key-metric-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="key-metric-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
                    <FaComment />
                  </div>
                  <div className="key-metric-info">
                    <span className="key-metric-value">{(totalEngagement.comments / (totalEngagement.totalBlogs || 1)).toFixed(1)}</span>
                    <span className="key-metric-label">Avg Comments/Post</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="key-metric-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="key-metric-icon" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                    <FaBolt />
                  </div>
                  <div className="key-metric-info">
                    <span className="key-metric-value">{(totalEngagement.views / 30).toFixed(0)}</span>
                    <span className="key-metric-label">Daily Avg Views</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="analytics-content"
          >
            <div className="categories-grid">
              {Object.entries(engagementByCategory).map(([category, data], index) => (
                <motion.div
                  key={category}
                  className="category-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="category-card-header">
                    <div className="category-icon" style={{ backgroundColor: COLORS[index % COLORS.length] + '20', color: COLORS[index % COLORS.length] }}>
                      <FaTags />
                    </div>
                    <h4>{category}</h4>
                    <span className="category-count">{data.count} posts</span>
                  </div>
                  <div className="category-stats">
                    <div className="category-stat">
                      <FaEye />
                      <span>{data.views.toLocaleString()}</span>
                      <small>views</small>
                    </div>
                    <div className="category-stat">
                      <FaHeart />
                      <span>{data.likes.toLocaleString()}</span>
                      <small>likes</small>
                    </div>
                    <div className="category-stat">
                      <FaComment />
                      <span>{data.comments.toLocaleString()}</span>
                      <small>comments</small>
                    </div>
                  </div>
                  <div className="category-progress">
                    <div className="progress-label">
                      <span>Engagement Rate</span>
                      <span>{data.views > 0 ? ((data.likes + data.comments) / data.views * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min((data.views > 0 ? ((data.likes + data.comments) / data.views * 100) : 0) * 5, 100)}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'top-posts' && (
          <motion.div
            key="top-posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="analytics-content"
          >
            {/* Sort Controls */}
            <div className="top-posts-controls">
              <span className="sort-label"><FaFilter /> Sort by:</span>
              <div className="sort-buttons">
                {[
                  { key: 'views', label: 'Views', icon: <FaEye /> },
                  { key: 'likes', label: 'Likes', icon: <FaHeart /> },
                  { key: 'comments', label: 'Comments', icon: <FaComment /> },
                  { key: 'shares', label: 'Shares', icon: <FaShare /> },
                  { key: 'engagement', label: 'Engagement', icon: <FaChartLine /> },
                ].map(sort => (
                  <button
                    key={sort.key}
                    className={`sort-btn ${sortBy === sort.key ? 'active' : ''}`}
                    onClick={() => setSortBy(sort.key)}
                  >
                    {sort.icon} {sort.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Posts List */}
            <div className="top-posts-list">
              {sortedBlogs.slice(0, 10).map((blog, index) => {
                const engagementRate = blog.views > 0
                  ? (((blog.likesCount || 0) + (blog.commentsCount || 0) + (blog.shares || 0)) / blog.views * 100).toFixed(1)
                  : 0;

                return (
                  <motion.div
                    key={blog._id}
                    className="top-post-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="post-rank">
                      {index < 3 ? (
                        <div className={`rank-badge rank-${index + 1}`}>
                          <FaTrophy />
                        </div>
                      ) : (
                        <span className="rank-number">#{index + 1}</span>
                      )}
                    </div>
                    <div className="post-image">
                      {blog.featuredImage ? (
                        <img src={blog.featuredImage} alt={blog.title} />
                      ) : (
                        <div className="post-image-placeholder">
                          <FaNewspaper />
                        </div>
                      )}
                    </div>
                    <div className="post-info">
                      <h4>{blog.title}</h4>
                      <div className="post-meta">
                        <span className="post-category">{blog.category || 'General'}</span>
                        <span className="post-author">by {blog.authorName || 'Unknown'}</span>
                        {blog.published ? (
                          <span className="status-badge published">Published</span>
                        ) : (
                          <span className="status-badge draft">Draft</span>
                        )}
                      </div>
                    </div>
                    <div className="post-metrics">
                      <div className="metric">
                        <FaEye />
                        <span>{(blog.views || 0).toLocaleString()}</span>
                      </div>
                      <div className="metric">
                        <FaHeart />
                        <span>{(blog.likesCount || 0).toLocaleString()}</span>
                      </div>
                      <div className="metric">
                        <FaComment />
                        <span>{(blog.commentsCount || 0).toLocaleString()}</span>
                      </div>
                      <div className="metric">
                        <FaShare />
                        <span>{(blog.shares || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="post-engagement">
                      <div className="engagement-value">{engagementRate}%</div>
                      <div className="engagement-label">Engagement</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {sortedBlogs.length === 0 && (
              <div className="no-data-container">
                <div className="no-data-icon">
                  <FaNewspaper />
                </div>
                <h3>No Blog Posts Found</h3>
                <p>Create your first blog post to start tracking analytics</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Analytics;
