import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaDollarSign, 
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const [period, setPeriod] = useState('month');

  // Revenue Data
  const revenueData = [
    { month: 'Jan', revenue: 12500, profit: 4200, expenses: 8300 },
    { month: 'Feb', revenue: 15800, profit: 5600, expenses: 10200 },
    { month: 'Mar', revenue: 14200, profit: 4800, expenses: 9400 },
    { month: 'Apr', revenue: 18900, profit: 7100, expenses: 11800 },
    { month: 'May', revenue: 22400, profit: 9200, expenses: 13200 },
    { month: 'Jun', revenue: 25600, profit: 11400, expenses: 14200 },
  ];

  // Category Distribution
  const categoryData = [
    { name: 'Solar Panels', value: 45, color: '#6366f1' },
    { name: 'Batteries', value: 20, color: '#f59e0b' },
    { name: 'Accessories', value: 10, color: '#8b5cf6' },
  ];

  // Growth Forecast
  const forecastData = [
    { month: 'Jul', actual: 25600, forecast: 28000 },
    { month: 'Aug', actual: null, forecast: 31500 },
    { month: 'Sep', actual: null, forecast: 34200 },
    { month: 'Oct', actual: null, forecast: 37800 },
    { month: 'Nov', actual: null, forecast: 41500 },
    { month: 'Dec', actual: null, forecast: 45000 },
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$109,400',
      change: '+23.5%',
      up: true,
      icon: <FaDollarSign />,
      color: '#10b981'
    },
    {
      title: 'Avg. Order Value',
      value: '$2,450',
      change: '+12.3%',
      up: true,
      icon: <FaChartLine />,
      color: '#6366f1'
    },
    {
      title: 'Growth Rate',
      value: '28.4%',
      change: '+5.2%',
      up: true,
      icon: <FaChartLine />,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="advanced-analytics">
      <div className="analytics-header">
        <h2>Advanced Analytics</h2>
        <div className="period-selector">
          <button 
            className={period === 'week' ? 'active' : ''}
            onClick={() => setPeriod('week')}
          >
            Week
          </button>
          <button 
            className={period === 'month' ? 'active' : ''}
            onClick={() => setPeriod('month')}
          >
            Month
          </button>
          <button 
            className={period === 'year' ? 'active' : ''}
            onClick={() => setPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            className="metric-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="metric-icon" style={{ backgroundColor: `${metric.color}20`, color: metric.color }}>
              {metric.icon}
            </div>
            <div className="metric-info">
              <p className="metric-label">{metric.title}</p>
              <h3 className="metric-value">{metric.value}</h3>
              <span className={`metric-change ${metric.up ? 'up' : 'down'}`}>
                {metric.up ? <FaArrowUp /> : <FaArrowDown />}
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Revenue & Profit Chart */}
        <div className="chart-container">
          <h3>Revenue & Profit Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="chart-container">
          <h3>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Forecast */}
        <div className="chart-container full-width">
          <h3>6-Month Growth Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="#10b981" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
