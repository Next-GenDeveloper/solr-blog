import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSolarPanel, FaBolt, FaLeaf, FaChartLine, FaArrowRight } from 'react-icons/fa';
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
    },
    {
      icon: <FaBolt />,
      title: 'Energy Efficiency',
      description: 'Maximize your energy savings with our cutting-edge solar technology.',
    },
    {
      icon: <FaLeaf />,
      title: 'Eco-Friendly',
      description: 'Reduce your carbon footprint and contribute to a sustainable future.',
    },
    {
      icon: <FaChartLine />,
      title: 'Cost Savings',
      description: 'Save money on energy bills while investing in renewable energy.',
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Harness the Power of the Sun
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Leading the renewable energy revolution with innovative solar solutions
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/shop">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Products
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
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
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span>Scroll Down</span>
          <div className="scroll-arrow"></div>
        </motion.div>
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
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
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
            <div className="products-grid">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  className="product-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="product-image">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Solar+Product'}
                        alt={product.name}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <div className="product-footer">
                        <span className="product-price">${product.price}</span>
                        <span className="product-link">
                          View Details <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
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
            <div className="blogs-grid">
              {featuredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/blog/${blog._id}`}>
                    <div className="blog-image">
                      <img
                        src={blog.featuredImage || 'https://via.placeholder.com/400x250?text=Solar+Blog'}
                        alt={blog.title}
                      />
                      <span className="blog-category">{blog.category}</span>
                    </div>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{blog.authorName}</span>
                      </div>
                      <h3>{blog.title}</h3>
                      <p>{blog.excerpt}</p>
                      <span className="read-more">
                        Read More <FaArrowRight />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
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
