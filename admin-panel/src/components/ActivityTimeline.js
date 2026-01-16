import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaUserPlus, 
  FaFileAlt, 
  FaBox,
  FaClock 
} from 'react-icons/fa';
import './ActivityTimeline.css';

const ActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      icon: <FaShoppingCart />,
      title: 'New Order Received',
      description: 'Order #5678 - Solar Panel Kit',
      amount: '$2,499',
      time: '10 minutes ago',
      color: '#8b5cf6'
    },
    {
      id: 2,
      icon: <FaUserPlus />,
      title: 'User Registration',
      description: 'John Smith joined as a new customer',
      time: '25 minutes ago',
      color: '#6366f1'
    },
    {
      id: 3,
      icon: <FaFileAlt />,
      title: 'Blog Post Updated',
      description: 'Solar Installation Guide edited',
      time: '1 hour ago',
      color: '#10b981'
    },
    {
      id: 4,
      icon: <FaBox />,
      title: 'Product Added',
      description: 'New inverter model added to catalog',
      time: '2 hours ago',
      color: '#f59e0b'
    },
    {
      id: 5,
      icon: <FaShoppingCart />,
      title: 'Order Delivered',
      description: 'Order #5432 successfully delivered',
      time: '3 hours ago',
      color: '#10b981'
    }
  ];

  return (
    <div className="activity-timeline">
      <div className="timeline-header">
        <div className="timeline-title">
          <FaClock className="timeline-icon" />
          <h3>Activity Timeline</h3>
        </div>
      </div>

      <div className="timeline-list">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="timeline-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="timeline-line" />
            <div 
              className="timeline-marker"
              style={{ backgroundColor: activity.color }}
            >
              {activity.icon}
            </div>
            <div className="timeline-content">
              <h4>{activity.title}</h4>
              <p>{activity.description}</p>
              {activity.amount && (
                <span className="timeline-amount">{activity.amount}</span>
              )}
              <span className="timeline-time">{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
