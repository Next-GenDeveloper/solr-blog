import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSolarPanel, FaBolt, FaLeaf, FaChartLine, FaArrowRight, FaClock, FaUsers, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const [blogsRes, productsRes] = await Promise.all([
        axios.get('/api/blogs?limit=3'),
        axios.get('/api/products?limit=4'),
      ]);
      setFeaturedBlogs(blogsRes.data.data);
      setFeaturedProducts(productsRes.data.data);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    }
  };

  const features = [
    {
      icon: <FaSolarPanel />,
      title: 'Solar Solutions',
      description: 'High-quality solar panels and equipment for residential and commercial use.',
      color: '#FF6B35',
    },
    {
      icon: <FaBolt />,
      title: 'Energy Efficiency',
      description: 'Maximize your energy savings with our cutting-edge solar technology.',
      color: '#F7931E',
    },
    {
      icon: <FaLeaf />,
      title: 'Eco-Friendly',
      description: 'Reduce your carbon footprint and contribute to a sustainable future.',
      color: '#2ECC71',
    },
    {
      icon: <FaChartLine />,
      title: 'Cost Savings',
      description: 'Save money on energy bills while investing in renewable energy.',
      color: '#3498DB',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: <FaUsers /> },
    { value: '15 Years', label: 'Industry Experience', icon: <FaClock /> },
    { value: '500+', label: 'Projects Completed', icon: <FaTrophy /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-shapes">
            <motion.div className="shape shape-1" animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }} />
            <motion.div className="shape shape-2" animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 8, delay: 1 }} />
            <motion.div className="shape shape-3" animate={{ y: [0, -15, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 7, delay: 0.5 }} />
          </div>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-badge"
          >
            ☀️ Welcome to Solar Expert
          </motion.div>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Harness the Power of the Sun
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Leading the renewable energy revolution with innovative solar solutions for a sustainable tomorrow
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/shop">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Products
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span>Scroll Down</span>
          <div className="scroll-arrow"></div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-padding">
        <div className="container">
          <motion.div
            className="stats-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                variants={itemVariants}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section-padding">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Solar Expert?</h2>
            <p>Discover the benefits of choosing our solar energy solutions</p>
          </motion.div>
          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ y: -15, boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}
              >
                <motion.div 
                  className="feature-icon-wrapper"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-products-section section-padding">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Featured Products</h2>
              <p>Explore our top-rated solar products</p>
            </motion.div>
            <motion.div
              className="products-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="product-card"
                  variants={itemVariants}
                  whileHover={{ y: -15 }}
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="product-image">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Solar+Product'}
                        alt={product.name}
                      />
                      <div className="product-overlay"></div>
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <div className="product-footer">
                        <span className="product-price">${product.price}</span>
                        <motion.span 
                          className="product-link"
                          whileHover={{ x: 5 }}
                        >
                          View Details <FaArrowRight />
                        </motion.span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="section-cta"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/shop">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Products
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="featured-blogs-section section-padding">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Latest Insights</h2>
              <p>Stay updated with the latest solar energy news and tips</p>
            </motion.div>
            <motion.div
              className="blogs-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  className="blog-card"
                  variants={itemVariants}
                  whileHover={{ y: -15 }}
                >
                  <Link to={`/blog/${blog._id}`}>
                    <div className="blog-image">
                      <img
                        src={blog.featuredImage || 'https://via.placeholder.com/400x250?text=Solar+Blog'}
                        alt={blog.title}
                      />
                      <motion.span 
                        className="blog-category"
                        whileHover={{ scale: 1.05 }}
                      >
                        {blog.category}
                      </motion.span>
                    </div>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{blog.authorName}</span>
                      </div>
                      <h3>{blog.title}</h3>
                      <p>{blog.excerpt}</p>
                      <motion.span 
                        className="read-more"
                        whileHover={{ x: 5 }}
                      >
                        Read More <FaArrowRight />
                      </motion.span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="section-cta"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/blog">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Blogs
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Go Solar?</h2>
          <p>Join thousands of satisfied customers who have made the switch to clean energy</p>
          <Link to="/contact">
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Today
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
