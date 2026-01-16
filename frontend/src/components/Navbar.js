import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, FaTimes, FaUser, FaSignOutAlt, FaUserCircle, 
  FaShoppingCart, FaChevronDown, FaSun, FaHome, FaInfoCircle,
  FaStore, FaBlog, FaEnvelope, FaTools, FaUserShield
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const menuItems = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'About', path: '/about', icon: <FaInfoCircle /> },
    { name: 'Shop', path: '/shop', icon: <FaStore /> },
    { name: 'Blog', path: '/blog', icon: <FaBlog /> },
    { name: 'Contact', path: '/contact', icon: <FaEnvelope /> },
    { name: 'Services', path: '/service-provider', icon: <FaTools /> },
  ];

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <motion.div 
              className="logo-wrapper"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="logo-icon-wrapper">
                <FaSun className="logo-sun-icon" />
              </div>
              <div className="logo-text-wrapper">
                <span className="logo-text-main">Solar</span>
                <span className="logo-text-accent">Expert</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar-nav">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`nav-link ${isActiveLink(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-link-text">{item.name}</span>
                  <span className="nav-link-indicator"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Cart */}
            <Link to="/cart" className="action-btn cart-btn">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="cart-wrapper"
              >
                <FaShoppingCart />
                <AnimatePresence>
                  {cart?.totalItems > 0 && (
                    <motion.span 
                      className="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {cart.totalItems > 99 ? '99+' : cart.totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <motion.button
                  className={`user-btn ${isUserMenuOpen ? 'active' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                  <FaChevronDown className={`chevron ${isUserMenuOpen ? 'rotated' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="user-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="dropdown-user-info">
                          <span className="dropdown-name">{user.name}</span>
                          <span className="dropdown-email">{user.email}</span>
                        </div>
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      <div className="dropdown-menu">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="dropdown-item"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaUserShield />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <Link
                          to="/cart"
                          className="dropdown-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaShoppingCart />
                          <span>My Cart</span>
                          {cart?.totalItems > 0 && (
                            <span className="item-badge">{cart.totalItems}</span>
                          )}
                        </Link>
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button className="dropdown-item logout-item" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login">
                  <motion.button
                    className="btn-login"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    className="btn-signup"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              className="mobile-toggle"
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu-content">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`mobile-link ${isActiveLink(item.path) ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mobile-link-icon">{item.icon}</span>
                      <span className="mobile-link-text">{item.name}</span>
                      {isActiveLink(item.path) && (
                        <span className="mobile-active-indicator"></span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                {!user && (
                  <div className="mobile-auth">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="mobile-btn-login">Sign In</button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="mobile-btn-signup">Get Started</button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
