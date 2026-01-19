import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, 
  FaBlog, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaEnvelope,
  FaComment,
  FaChartLine,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaCog,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 968);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 968) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
      if (!e.target.closest('.user-dropdown')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const menuItems = [
    { path: '/', icon: <FaTachometerAlt />, label: 'Dashboard', exact: true },
    { path: '/blogs', icon: <FaBlog />, label: 'Blogs' },
    { path: '/products', icon: <FaBox />, label: 'Products' },
    { path: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/users', icon: <FaUsers />, label: 'Users' },
    { path: '/comments', icon: <FaComment />, label: 'Comments' },
    { path: '/analytics', icon: <FaChartLine />, label: 'Analytics' },
    { path: '/contacts', icon: <FaEnvelope />, label: 'Contacts' },
  ];

  const notifications = [
    { id: 1, type: 'order', message: 'New order received #1234', time: '5 min ago', unread: true },
    { id: 2, type: 'user', message: 'New user registered', time: '15 min ago', unread: true },
    { id: 3, type: 'comment', message: 'New comment on blog post', time: '1 hour ago', unread: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="admin-logo">
            <span className="logo-icon">☀️</span>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span 
                  className="logo-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  Solar Expert
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {window.innerWidth > 968 && (
            <button className="collapse-btn" onClick={toggleSidebarCollapse}>
              <FaBars />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-title">Main Menu</span>}
            {menuItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span 
                      className="nav-label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive(item.path, item.exact) && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-title">Management</span>}
            {menuItems.slice(4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span 
                      className="nav-label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive(item.path, item.exact) && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="activeIndicator2"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <a 
            href="http://localhost:3000" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="visit-site-btn"
            title={sidebarCollapsed ? 'Visit Website' : ''}
          >
            <FaHome />
            {!sidebarCollapsed && <span>Visit Website</span>}
          </a>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <FaSignOutAlt />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className="header-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-shortcut">⌘K</span>
            </div>
          </div>

          <div className="header-right">
            {/* Theme Toggle */}
            <button className="header-icon-btn theme-toggle" onClick={toggleTheme}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Notifications */}
            <div className="notifications-dropdown">
              <button 
                className="header-icon-btn notification-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
              >
                <FaBell />
                <span className="notification-badge">3</span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    className="dropdown-menu notifications-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="dropdown-header">
                      <h3>Notifications</h3>
                      <button className="mark-all-read">Mark all as read</button>
                    </div>
                    <div className="dropdown-content">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        >
                          <div className="notification-icon">
                            {notification.type === 'order' && <FaShoppingCart />}
                            {notification.type === 'user' && <FaUsers />}
                            {notification.type === 'comment' && <FaComment />}
                          </div>
                          <div className="notification-content">
                            <p>{notification.message}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="dropdown-footer">
                      <Link to="/notifications">View all notifications</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <button className="header-icon-btn">
              <FaCog />
            </button>

            {/* User Menu */}
            <div className="user-dropdown">
              <button 
                className="user-menu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
              >
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'Admin'}</span>
                  <span className="user-role">Administrator</span>
                </div>
                <FaChevronDown className={`dropdown-arrow ${showUserMenu ? 'rotated' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    className="dropdown-menu user-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="dropdown-user-info">
                      <div className="user-avatar large">
                        <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                      </div>
                      <div>
                        <h4>{user?.name || 'Admin'}</h4>
                        <p>{user?.email || 'admin@example.com'}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item">
                      <FaUsers /> My Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <FaCog /> Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth <= 968 && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default AdminLayout;
