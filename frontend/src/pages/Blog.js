import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowRight, FaClock, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['All', 'General', 'Technology', 'Installation', 'Maintenance', 'News'];

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `/api/blogs?page=${currentPage}&limit=9`;
      
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      const { data } = await axios.get(url);
      setBlogs(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Solar Energy Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay informed with the latest insights, news, and tips about solar energy
          </motion.p>
        </div>
      </section>

      <section className="blog-content section-padding">
        <div className="container">
          {/* Filters */}
          <div className="blog-filters">
            <motion.div
              className="search-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <form onSubmit={handleSearch}>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>
            </motion.div>

            <motion.div
              className="category-filters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category || (!selectedCategory && category === 'All') ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category === 'All' ? '' : category)}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="loader"></div>
          ) : blogs.length > 0 ? (
            <>
              <div className="blogs-grid">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    className="blog-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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
                          <span className="meta-item">
                            <FaClock /> {new Date(blog.publishedDate).toLocaleDateString()}
                          </span>
                          <span className="meta-item">
                            <FaUser /> {blog.authorName}
                          </span>
                        </div>
                        <h3>{blog.title}</h3>
                        <p>{blog.excerpt || blog.content.substring(0, 150) + '...'}</p>
                        <div className="blog-footer">
                          <span className="read-more">
                            Read More <FaArrowRight />
                          </span>
                          <span className="blog-views">{blog.views} views</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-blogs">
              <p>No articles found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
