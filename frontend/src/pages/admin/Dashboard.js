import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaBlog, FaBox, FaShoppingCart, 
  FaArrowUp, FaArrowDown, FaEllipsisV,
  FaSearch, FaBell 
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, these endpoints might return trend data too
      const [usersRes, blogsRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/blogs/all'),
        axios.get('/api/products/all'),
        axios.get('/api/orders'),
      ]);

      setStats({
        users: usersRes.data.count || 124,
        blogs: blogsRes.data.count || 45,
        products: productsRes.data.count || 89,
        orders: ordersRes.data.count || 320,
        revenue: 45250, // Mock revenue
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback mock data for demo visual
      setStats({
          users: 1543,
          blogs: 32,
          products: 84,
          orders: 456,
          revenue: 12500
      })
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `$${stats.revenue.toLocaleString()}`, 
      icon: '$', 
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: '+12.5%', 
      isUp: true 
    },
    { 
      title: 'Active Users', 
      value: stats.users.toLocaleString(), 
      icon: <FaUsers />, 
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      trend: '+5.2%', 
      isUp: true 
    },
    { 
      title: 'New Orders', 
      value: stats.orders.toLocaleString(), 
      icon: <FaShoppingCart />, 
      color: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
      trend: '-2.4%', 
      isUp: false 
    },
    { 
      title: 'Total Products', 
      value: stats.products.toLocaleString(), 
      icon: <FaBox />, 
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: '+8.1%', 
      isUp: true 
    },
  ];

  const chartData = [
    { name: 'Jan', revenue: 4000, orders: 2400 },
    { name: 'Feb', revenue: 3000, orders: 1398 },
    { name: 'Mar', revenue: 2000, orders: 9800 },
    { name: 'Apr', revenue: 2780, orders: 3908 },
    { name: 'May', revenue: 1890, orders: 4800 },
    { name: 'Jun', revenue: 2390, orders: 3800 },
    { name: 'Jul', revenue: 3490, orders: 4300 },
  ];

  const recentOrders = [
    { id: '#ORD-001', user: 'John Doe', product: 'Solar Panel X500', status: 'Completed', amount: '$450.00' },
    { id: '#ORD-002', user: 'Jane Smith', product: 'Inverter Pro', status: 'Pending', amount: '$120.50' },
    { id: '#ORD-003', user: 'Bob Johnson', product: 'Battery Pack', status: 'Processing', amount: '$850.00' },
    { id: '#ORD-004', user: 'Alice Brown', product: 'Solar Kit', status: 'Completed', amount: '$1,200.00' },
    { id: '#ORD-005', user: 'Charlie Wilson', product: 'Cable Set', status: 'Cancelled', amount: '$45.00' },
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
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
            <h1>Dashboard Overview</h1>
            <p>Welcome back, here's what's happening today.</p>
        </div>
        <div className="header-actions">
            <div className="search-bar">
                <FaSearch />
                <input type="text" placeholder="Search..." />
            </div>
            <button className="icon-btn"><FaBell /></button>
            <button className="upgrade-btn">Download Report</button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="stat-icon-wrapper" style={{ background: stat.color }}>
                {typeof stat.icon === 'string' ? <span className="text-icon">{stat.icon}</span> : stat.icon}
              </div>
              <div className="stat-info">
                <span className="stat-title">{stat.title}</span>
                <h3 className="stat-value">{stat.value}</h3>
                <div className={`stat-trend ${stat.isUp ? 'trend-up' : 'trend-down'}`}>
                  {stat.isUp ? <FaArrowUp /> : <FaArrowDown />} 
                  <span>{stat.trend} from last month</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Charts Section */}
      <div className="charts-grid">
        <motion.div 
            className="chart-card main-chart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <h3>Revenue Analytics</h3>
            <button className="more-btn"><FaEllipsisV /></button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#667eea" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
            className="chart-card secondary-chart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
        >
            <div className="card-header">
                <h3>Orders Traffic</h3>
                <button className="more-btn"><FaEllipsisV /></button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}  stroke="#f0f0f0"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}  
                    />
                    <Bar dataKey="orders" fill="#ff9966" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div 
        className="recent-orders-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="view-all-btn">View All</button>
        </div>
        <div className="table-container">
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {recentOrders.map((order) => (
                        <tr key={order.id}>
                            <td className="order-id">{order.id}</td>
                            <td>
                                <div className="user-cell">
                                    <div className="user-avatar">{order.user.charAt(0)}</div>
                                    <span>{order.user}</span>
                                </div>
                            </td>
                            <td>{order.product}</td>
                            <td>
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="amount-cell">{order.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;