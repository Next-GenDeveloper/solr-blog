import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaBlog, FaBox, FaShoppingCart, 
  FaArrowUp, FaArrowDown, FaPlus, FaRupeeSign,
  FaFileAlt, FaUserPlus, FaChartLine, FaSync,
  FaClock, FaExclamationTriangle, FaTruck, FaCheckCircle,
  FaTimesCircle, FaHourglassHalf, FaEye
} from 'react-icons/fa';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    counts: { users: 0, products: 0, blogs: 0, orders: 0, newUsersThisMonth: 0 },
    revenue: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    ordersByStatus: {},
    chartData: [],
    recentOrders: [],
    recentUsers: [],
    lowStockProducts: [],
    topProducts: [],
    trends: { orders: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [statsRes, activityRes] = await Promise.all([
        axios.get('/api/dashboard/stats', config),
        axios.get('/api/dashboard/recent-activity', config)
      ]);

      if (statsRes.data.success) {
        setDashboardData(statsRes.data.data);
      }

      if (activityRes.data.success) {
        setRecentActivity(activityRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to individual API calls if dashboard API fails
      try {
        const [usersRes, blogsRes, productsRes, ordersRes] = await Promise.all([
          axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/blogs/all'),
          axios.get('/api/products/all'),
          axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setDashboardData(prev => ({
          ...prev,
          counts: {
            users: usersRes.data.count || usersRes.data.users?.length || 0,
            blogs: blogsRes.data.count || blogsRes.data.data?.length || 0,
            products: productsRes.data.count || productsRes.data.data?.length || 0,
            orders: ordersRes.data.count || ordersRes.data.data?.length || 0,
          }
        }));
      } catch (fallbackError) {
        console.error('Fallback fetch error:', fallbackError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Format currency for Pakistan
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const statCards = [
    { 
      title: 'Total Users', 
      value: dashboardData.counts.users, 
      icon: <FaUsers />, 
      color: '#6366f1', 
      bgColor: '#eef2ff',
      subtitle: `${dashboardData.counts.newUsersThisMonth || 0} new this month`,
      link: '/admin/users'
    },
    { 
      title: 'Total Products', 
      value: dashboardData.counts.products, 
      icon: <FaBox />, 
      color: '#f59e0b', 
      bgColor: '#fef3c7',
      subtitle: `${dashboardData.lowStockProducts?.length || 0} low stock`,
      link: '/admin/products'
    },
    { 
      title: 'Total Orders', 
      value: dashboardData.counts.orders, 
      icon: <FaShoppingCart />, 
      color: '#8b5cf6', 
      bgColor: '#f5f3ff',
      trend: dashboardData.trends?.orders || 0,
      link: '/admin/orders'
    },
    { 
      title: 'Total Blogs', 
      value: dashboardData.counts.blogs, 
      icon: <FaBlog />, 
      color: '#10b981', 
      bgColor: '#d1fae5',
      subtitle: 'Published posts',
      link: '/admin/blogs'
    },
  ];

  const revenueCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardData.revenue?.totalRevenue || 0),
      icon: <FaRupeeSign />,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(dashboardData.revenue?.avgOrderValue || 0),
      icon: <FaChartLine />,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    }
  ];

  // Order status data for pie chart
  const orderStatusData = [
    { name: 'Pending', value: dashboardData.ordersByStatus?.pending || 0, color: '#f59e0b' },
    { name: 'Processing', value: dashboardData.ordersByStatus?.processing || 0, color: '#3b82f6' },
    { name: 'Shipped', value: dashboardData.ordersByStatus?.shipped || 0, color: '#8b5cf6' },
    { name: 'Delivered', value: dashboardData.ordersByStatus?.delivered || 0, color: '#10b981' },
    { name: 'Cancelled', value: dashboardData.ordersByStatus?.cancelled || 0, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Chart data - use real data or fallback
  const chartData = dashboardData.chartData?.length > 0 
    ? dashboardData.chartData 
    : [];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return <FaShoppingCart />;
      case 'user': return <FaUserPlus />;
      case 'blog': return <FaFileAlt />;
      default: return <FaClock />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'order': return '#8b5cf6';
      case 'user': return '#6366f1';
      case 'blog': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf />;
      case 'processing': return <FaSync />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'cancelled': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const quickActions = [
    { 
      icon: <FaPlus />, 
      label: 'Add Product', 
      color: '#f59e0b',
      onClick: () => navigate('/admin/products')
    },
    { 
      icon: <FaFileAlt />, 
      label: 'New Blog', 
      color: '#10b981',
      onClick: () => navigate('/admin/blogs')
    },
    { 
      icon: <FaShoppingCart />, 
      label: 'View Orders', 
      color: '#8b5cf6',
      onClick: () => navigate('/admin/orders')
    },
    { 
      icon: <FaChartLine />, 
      label: 'Analytics', 
      color: '#6366f1',
      onClick: () => navigate('/admin/analytics')
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
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
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Real-time insights for your solar energy business</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-refresh" 
            onClick={fetchDashboardData}
            disabled={refreshing}
          >
            <FaSync className={refreshing ? 'spinning' : ''} /> Refresh
          </button>
          <button className="btn-add" onClick={() => navigate('/admin/products')}>
            <FaPlus /> Add Product
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => navigate(stat.link)}
            >
              <div className="stat-top">
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                  {stat.icon}
                </div>
                {stat.trend !== undefined && (
                  <div className={`trend-badge ${stat.trend >= 0 ? 'up' : 'down'}`}>
                    {stat.trend >= 0 ? <FaArrowUp /> : <FaArrowDown />} 
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
              <div className="stat-info">
                <h3>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</h3>
                <p>{stat.title}</p>
                {stat.subtitle && <span className="stat-subtitle">{stat.subtitle}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Revenue Cards */}
      <section className="revenue-section">
        <div className="revenue-grid">
          {revenueCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="revenue-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="revenue-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
                {card.icon}
              </div>
              <div className="revenue-info">
                <span className="revenue-label">{card.title}</span>
                <span className="revenue-value">{card.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        {/* Revenue Chart */}
        <section className="chart-section">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="chart-header">
              <h2>Revenue & Orders Trend</h2>
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

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 25px -3px rgba(0,0,0,0.15)',
                      padding: '12px 16px'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-message">
                <FaChartLine size={48} />
                <p>No revenue data available yet</p>
                <span>Data will appear once orders are placed</span>
              </div>
            )}
          </motion.div>
        </section>

        {/* Side Panels */}
        <div className="dashboard-side-panels">
          {/* Order Status Pie Chart */}
          <motion.section 
            className="side-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2>Order Status</h2>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-small">
                <p>No orders yet</p>
              </div>
            )}
          </motion.section>

          {/* Quick Actions */}
          <motion.section 
            className="side-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
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
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="dashboard-bottom-grid">
        {/* Recent Orders */}
        <motion.section 
          className="data-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="data-card-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn" onClick={() => navigate('/admin/orders')}>
              View All <FaEye />
            </button>
          </div>
          {dashboardData.recentOrders?.length > 0 ? (
            <div className="recent-orders-list">
              {dashboardData.recentOrders.map((order, index) => (
                <div key={order._id || index} className="order-item">
                  <div className="order-info">
                    <span className="order-number">{order.orderNumber}</span>
                    <span className="order-customer">{order.customerInfo?.name || order.customerInfo?.fullName}</span>
                  </div>
                  <div className="order-amount">{formatCurrency(order.total)}</div>
                  <div className="order-status" style={{ color: getStatusColor(order.orderStatus) }}>
                    {getStatusIcon(order.orderStatus)}
                    <span>{order.orderStatus}</span>
                  </div>
                  <div className="order-date">{formatTimeAgo(order.createdAt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-small">
              <FaShoppingCart size={32} />
              <p>No orders yet</p>
            </div>
          )}
        </motion.section>

        {/* Recent Activity */}
        <motion.section 
          className="data-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2>Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-avatar" style={{ color: getActivityColor(activity.type) }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-text">
                    <p>{activity.text}</p>
                    <span><FaClock /> {formatTimeAgo(activity.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-small">
              <FaClock size={32} />
              <p>No recent activity</p>
            </div>
          )}
        </motion.section>

        {/* Low Stock Alert */}
        <motion.section 
          className="data-card alert-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="data-card-header">
            <h2><FaExclamationTriangle /> Low Stock Alert</h2>
          </div>
          {dashboardData.lowStockProducts?.length > 0 ? (
            <div className="low-stock-list">
              {dashboardData.lowStockProducts.map((product, index) => (
                <div key={product._id || index} className="stock-item">
                  <span className="product-name">{product.name}</span>
                  <span className={`stock-count ${product.stock <= 5 ? 'critical' : 'warning'}`}>
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-small success">
              <FaCheckCircle size={32} />
              <p>All products in stock!</p>
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
