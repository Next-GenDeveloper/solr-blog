import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaBlog, FaBox, FaShoppingCart, 
  FaArrowUp, FaArrowDown, FaPlus, FaExternalLinkAlt,
  FaFileAlt, FaUserPlus, FaCalendarAlt
} from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    products: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

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
        users: usersRes.data.count || 0,
        blogs: blogsRes.data.count || 0,
        products: productsRes.data.count || 0,
        orders: ordersRes.data.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users',    value: stats.users,    icon: <FaUsers />,    color: '#4f46e5', trend: '+12%', up: true },
    { title: 'Total Blogs',    value: stats.blogs,    icon: <FaBlog />,     color: '#10b981', trend: '+5%',  up: true },
    { title: 'Total Products', value: stats.products, icon: <FaBox />,      color: '#f59e0b', trend: '+8%',  up: true },
    { title: 'Total Orders',   value: stats.orders,   icon: <FaShoppingCart />, color: '#8b5cf6', trend: '-2%',  up: false },
  ];

  const chartData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 1600 },
    { name: 'Apr', value: 2400 },
    { name: 'May', value: 3200 },
    { name: 'Jun', value: 2800 },
  ];

  const recentActivity = [
    { id: 1, type: 'order', text: 'New order #1234 from John Doe', time: '2 mins ago' },
    { id: 2, type: 'user', text: 'New user registered: Jane Smith', time: '1 hour ago' },
    { id: 3, type: 'blog', text: 'New blog post published: Solar Trends', time: '3 hours ago' },
    { id: 4, type: 'product', text: 'Product stock low: Solar Panel 400W', time: '5 hours ago' },
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
      transition={{ duration: 0.6 }}
    >
      <header className="dashboard-header">
        <div>
          <h1>Welcome Back, Admin</h1>
          <p>Here's what's happening with your energy store today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-add">
            <FaPlus /> Quick Action
          </button>
        </div>
      </header>

      <section className="stats-section">
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="stat-top">
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
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

      <div className="dashboard-main-grid">
        <section className="chart-section">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="chart-header">
              <h2>Growth Overview</h2>
              <div className="chart-filters">
                <button className="filter-btn active">6 Months</button>
                <button className="filter-btn">1 Year</button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
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
              <div className="action-item">
                <FaFileAlt className="action-icon" />
                <span className="action-label">New Blog</span>
              </div>
              <div className="action-item">
                <FaPlus className="action-icon" />
                <span className="action-label">Add Product</span>
              </div>
              <div className="action-item">
                <FaUserPlus className="action-icon" />
                <span className="action-label">Add User</span>
              </div>
              <div className="action-item">
                <FaCalendarAlt className="action-icon" />
                <span className="action-label">Reports</span>
              </div>
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
                <div key={activity.id} className="activity-item">
                  <div className="activity-avatar">
                   <FaExternalLinkAlt size={14} />
                  </div>
                  <div className="activity-text">
                    <p>{activity.text}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
