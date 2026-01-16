import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBlog, FaBox, FaShoppingCart } from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
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
    { title: 'Total Users',    value: stats.users,    icon: <FaUsers />,    color: '#3b82f6' },
    { title: 'Total Blogs',    value: stats.blogs,    icon: <FaBlog />,     color: '#10b981' },
    { title: 'Total Products', value: stats.products, icon: <FaBox />,      color: '#f59e0b' },
    { title: 'Total Orders',   value: stats.orders,   icon: <FaShoppingCart />, color: '#8b5cf6' },
  ];

  // More realistic-looking sample data
  const chartData = [
    { name: 'Jan', value: 1200, prev: 900 },
    { name: 'Feb', value: 1900, prev: 1400 },
    { name: 'Mar', value: 1600, prev: 1700 },
    { name: 'Apr', value: 2400, prev: 2100 },
    { name: 'May', value: 3200, prev: 2800 },
    { name: 'Jun', value: 2800, prev: 3100 },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview • {new Date().toLocaleDateString()}</p>
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
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.value.toLocaleString()}</h3>
                <p>{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="chart-section">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="chart-header">
            <h2>Revenue & Activity Trend</h2>
            <p>Last 6 months</p>
          </div>

          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tick={{ fill: '#6b7280' }} />
              <YAxis axisLine={false} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255,255,255,0.98)', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="This period" 
                stroke="#3b82f6" 
                strokeWidth={2.5} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="prev" 
                name="Previous" 
                stroke="#9ca3af" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* You can easily add more sections later: recent orders, top products, activity feed... */}
    </div>
  );
};

export default Dashboard;