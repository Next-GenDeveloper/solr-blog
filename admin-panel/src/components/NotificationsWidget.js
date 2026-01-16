import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import './NotificationsWidget.css';

const NotificationsWidget = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: <FaCheckCircle />,
      title: 'Order Completed',
      message: 'Order #1234 has been successfully delivered',
      time: '5 minutes ago',
      color: '#10b981'
    },
    {
      id: 2,
      type: 'warning',
      icon: <FaExclamationTriangle />,
      title: 'Low Stock Alert',
      message: 'Solar Panel 400W stock is running low',
      time: '1 hour ago',
      color: '#f59e0b'
    },
    {
      id: 3,
      type: 'info',
      icon: <FaInfoCircle />,
      title: 'New User Registration',
      message: '3 new users registered today',
      time: '2 hours ago',
      color: '#06b6d4'
    },
    {
      id: 4,
      type: 'success',
      icon: <FaCheckCircle />,
      title: 'Blog Published',
      message: 'Your blog post "Solar Energy Trends" is now live',
      time: '3 hours ago',
      color: '#10b981'
    }
  ];

  return (
    <div className="notifications-widget">
      <div className="widget-header">
        <div className="widget-title">
          <FaBell className="widget-icon" />
          <h3>Recent Notifications</h3>
        </div>
        <span className="notification-badge">{notifications.length}</span>
      </div>

      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            className="notification-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className="notification-icon"
              style={{ backgroundColor: `${notification.color}15`, color: notification.color }}
            >
              {notification.icon}
            </div>
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="view-all-btn">View All Notifications</button>
    </div>
  );
};

export default NotificationsWidget;
