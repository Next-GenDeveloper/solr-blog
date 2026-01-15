import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaEye, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}`);
      setBlog(data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (!blog) {
    return <div className="error-message">Blog post not found</div>;
  }

  return (
    <div className="blog-detail-page">
      <div className="container section-padding">
        <Link to="/blog" className="back-link">
          <FaArrowLeft /> Back to Blog
        </Link>

        <motion.article
          className="blog-article"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <header className="article-header">
            <span className="article-category">{blog.category}</span>
            <h1>{blog.title}</h1>
            
            <div className="article-meta">
              <span className="meta-item">
                <FaUser /> {blog.authorName}
              </span>
              <span className="meta-item">
                <FaClock /> {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="meta-item">
                <FaEye /> {blog.views} views
              </span>
            </div>
          </header>

          {blog.featuredImage && (
            <div className="article-image">
              <img src={blog.featuredImage} alt={blog.title} />
            </div>
          )}

          <div className="article-content">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="article-tags">
              <h4>Tags:</h4>
              <div className="tags-list">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail;
