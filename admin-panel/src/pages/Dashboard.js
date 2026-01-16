import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaBlog, FaBox, FaShoppingCart, 
  FaArrowUp, FaArrowDown, FaPlus,
  FaFileAlt, FaUserPlus, FaChartLine,
  FaClock, FaExclamationCircle
} from 'react-icons/fa';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import axios from 'axios';
import NotificationsWidget from '../components/NotificationsWidget';
import ActivityTimeline from '../components/ActivityTimeline';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    products: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, blogsRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/blogs/all'),
        axios.get('/api/products/all'),
        axios.get('/api/orders'),
      ]);

      setStats({
        users: usersRes.data.count || usersRes.data.users?.length || 0,
        blogs: blogsRes.data.count || blogsRes.data.blogs?.length || 0,
        products: productsRes.data.count || productsRes.data.products?.length || 0,
        orders: ordersRes.data.count || ordersRes.data.orders?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.users, 
      icon: <FaUsers />, 
      color: '#6366f1', 
      bgColor: '#eef2ff',
      trend: '+12.5%', 
      up: true,
      link: '/admin/users'
    },
    { 
      title: 'Total Blogs', 
      value: stats.blogs, 
      icon: <FaBlog />, 
      color: '#10b981', 
      bgColor: '#d1fae5',
      trend: '+5.2%', 
      up: true,
      link: '/admin/blogs'
    },
    { 
      title: 'Total Products', 
      value: stats.products, 
      icon: <FaBox />, 
      color: '#f59e0b', 
      bgColor: '#fef3c7',
      trend: '+8.1%', 
      up: true,
      link: '/admin/products'
    },
    { 
      title: 'Total Orders', 
      value: stats.orders, 
      icon: <FaShoppingCart />, 
      color: '#8b5cf6', 
      bgColor: '#f5f3ff',
      trend: '-2.3%', 
      up: false,
      link: '/admin/orders'
    },
  ];

  const chartData = selectedPeriod === '6months' ? [
    { name: 'Jan', revenue: 1200, orders: 45, users: 12 },
    { name: 'Feb', revenue: 1900, orders: 68, users: 18 },
    { name: 'Mar', revenue: 1600, orders: 52, users: 15 },
    { name: 'Apr', revenue: 2400, orders: 89, users: 24 },
    { name: 'May', revenue: 3200, orders: 112, users: 32 },
    { name: 'Jun', revenue: 2800, orders: 95, users: 28 },
  ] : [
    { name: 'Jan', revenue: 1200, orders: 45, users: 12 },
    { name: 'Feb', revenue: 1900, orders: 68, users: 18 },
    { name: 'Mar', revenue: 1600, orders: 52, users: 15 },
    { name: 'Apr', revenue: 2400, orders: 89, users: 24 },
    { name: 'May', revenue: 3200, orders: 112, users: 32 },
    { name: 'Jun', revenue: 2800, orders: 95, users: 28 },
    { name: 'Jul', revenue: 3400, orders: 118, users: 35 },
    { name: 'Aug', revenue: 3800, orders: 135, users: 38 },
    { name: 'Sep', revenue: 3100, orders: 108, users: 30 },
    { name: 'Oct', revenue: 3600, orders: 125, users: 36 },
    { name: 'Nov', revenue: 4200, orders: 148, users: 42 },
    { name: 'Dec', revenue: 4800, orders: 165, users: 48 },
  ];

  const recentActivity = [
    { 
      id: 1, 
      type: 'order', 
      icon: <FaShoppingCart />,
      text: 'New order #1234 from John Doe', 
      time: '2 mins ago',
      color: '#8b5cf6'
    },
    { 
      id: 2, 
      type: 'user', 
      icon: <FaUserPlus />,
      text: 'New user registered: Jane Smith', 
      time: '1 hour ago',
      color: '#6366f1'
    },
    { 
      id: 3, 
      type: 'blog', 
      icon: <FaFileAlt />,
      text: 'New blog post published: Solar Trends', 
      time: '3 hours ago',
      color: '#10b981'
    },
    { 
      id: 4, 
      type: 'product', 
      icon: <FaExclamationCircle />,
      text: 'Product stock low: Solar Panel 400W', 
      time: '5 hours ago',
      color: '#f59e0b'
    },
  ];

  const quickActions = [
    { 
      icon: <FaFileAlt />, 
      label: 'New Blog', 
      color: '#10b981',
      onClick: () => navigate('/admin/blogs')
    },
    { 
      icon: <FaPlus />, 
      label: 'Add Product', 
      color: '#f59e0b',
      onClick: () => navigate('/admin/products')
    },
    { 
      icon: <FaUserPlus />, 
      label: 'Add User', 
      color: '#6366f1',
      onClick: () => navigate('/admin/users')
    },
    { 
      icon: <FaChartLine />, 
      label: 'View Reports', 
      color: '#8b5cf6',
      onClick: () => {}
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="dashboard-header">
        <div>
          <h1>Welcome Back, Admin! 👋</h1>
          <p>Here's what's happening with your solar energy store today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-add" onClick={() => navigate('/admin/products')}>
            <FaPlus /> Add New Product
          </button>
        </div>
      </header>

      <section className="stats-section">
        <div className="stats-section-header">
          <h2>Key Performance Metrics</h2>
          <p>Real-time overview of your business statistics and growth trends</p>
        </div>
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => navigate(stat.link)}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-top">
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className={`trend-badge ${stat.up ? 'up' : 'down'}`}>
                  {stat.up ? <FaArrowUp /> : <FaArrowDown />} {stat.trend}
                </div>
              </div>
              <div className="stat-info">
                <h3>{stat.value.toLocaleString()}</h3>
                <p>{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Widgets Row */}
      <section className="widgets-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <NotificationsWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <ActivityTimeline />
        </motion.div>
      </section>

      {/* Advanced Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <AdvancedAnalytics />
      </motion.div>

      <div className="dashboard-main-grid">
        <section className="chart-section">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="chart-header">
              <h2>Revenue & Growth Overview</h2>
              <div className="chart-filters">
                <button 
                  className={`filter-btn ${selectedPeriod === '6months' ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod('6months')}
                >
                  6 Months
                </button>
                <button 
                  className={`filter-btn ${selectedPeriod === '1year' ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod('1year')}
                >
                  1 Year
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -3px rgba(0,0,0,0.15)',
                    padding: '12px 16px',
                    backgroundColor: 'white'
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}
                  itemStyle={{ padding: '4px 0', fontSize: '14px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorOrders)"
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </section>

        <div className="dashboard-side-panels">
          <motion.section 
            className="side-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <motion.div 
                  key={index}
                  className="action-item"
                  onClick={action.onClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="action-icon" style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <span className="action-label">{action.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            className="side-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <motion.div 
                  key={activity.id} 
                  className="activity-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: activity.id * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="activity-avatar" style={{ color: activity.color }}>
                    {activity.icon}
                  </div>
                  <div className="activity-text">
                    <p>{activity.text}</p>
                    <span><FaClock style={{ marginRight: '4px', fontSize: '0.75rem' }} />{activity.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
