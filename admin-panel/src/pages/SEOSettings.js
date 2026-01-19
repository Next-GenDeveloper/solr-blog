import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaSearch, FaGlobe } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const SEOSettings = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const [seoData, setSeoData] = useState({});
  
  const [formData, setFormData] = useState({
    page: 'home',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
  });

  const pages = [
    { id: 'home', name: 'Home Page', icon: '🏠' },
    { id: 'about', name: 'About Us', icon: 'ℹ️' },
    { id: 'contact', name: 'Contact', icon: '📧' },
    { id: 'shop', name: 'Shop', icon: '🛒' },
    { id: 'blog', name: 'Blog', icon: '📝' },
    { id: 'services', name: 'Services', icon: '⚡' },
  ];

  useEffect(() => {
    fetchAllSEOData();
  }, []);

  useEffect(() => {
    if (seoData[selectedPage]) {
      setFormData(seoData[selectedPage]);
    } else {
      // Reset to defaults for new page
      setFormData({
        page: selectedPage,
        slug: selectedPage === 'home' ? '' : selectedPage,
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogType: 'website',
        canonicalUrl: '',
        robotsIndex: true,
        robotsFollow: true,
      });
    }
  }, [selectedPage, seoData]);

  const fetchAllSEOData = async () => {
    try {
      const { data } = await axios.get('/api/seo');
      const seoMap = {};
      data.data.forEach(item => {
        seoMap[item.page] = item;
      });
      setSeoData(seoMap);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/seo', formData);
      toast.success('SEO settings saved successfully');
      fetchAllSEOData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save SEO settings');
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1><FaSearch /> SEO Settings</h1>
          <p>Manage SEO for all static pages</p>
        </div>
      </div>

      <div className="seo-settings-container" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Page Selector */}
        <div className="page-selector" style={{ background: '#fff', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Select Page</h3>
          {pages.map(page => (
            <button
              key={page.id}
              className={`page-item ${selectedPage === page.id ? 'active' : ''}`}
              onClick={() => setSelectedPage(page.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: selectedPage === page.id ? '#007bff' : 'transparent',
                color: selectedPage === page.id ? '#fff' : '#333',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: '20px' }}>{page.icon}</span>
              <span>{page.name}</span>
            </button>
          ))}
        </div>

        {/* SEO Form */}
        <motion.div
          className="seo-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', padding: '32px', borderRadius: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <FaGlobe style={{ fontSize: '24px', color: '#007bff' }} />
            <h2 style={{ margin: 0 }}>
              {pages.find(p => p.id === selectedPage)?.name} - SEO Configuration
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 style={{ marginBottom: '16px' }}>Basic Information</h3>
              
              <div className="form-group">
                <label>Page Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={selectedPage === 'home' ? 'Leave blank for homepage' : selectedPage}
                  required={selectedPage !== 'home'}
                />
                <small style={{ color: '#666' }}>
                  URL: {window.location.origin}/{formData.slug || ''}
                </small>
              </div>

              <div className="form-group">
                <label>Meta Title * (60 chars max)</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  maxLength="60"
                  required
                />
                <small style={{ color: '#666' }}>{formData.metaTitle.length}/60 characters</small>
              </div>

              <div className="form-group">
                <label>Meta Description * (160 chars max)</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  maxLength="160"
                  rows="4"
                  required
                />
                <small style={{ color: '#666' }}>{formData.metaDescription.length}/160 characters</small>
              </div>

              <div className="form-group">
                <label>Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="solar, energy, renewable"
                />
              </div>
            </div>

            <div className="form-section" style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Open Graph (Social Media)</h3>
              
              <div className="form-group">
                <label>OG Title</label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  placeholder="Leave blank to use Meta Title"
                />
              </div>

              <div className="form-group">
                <label>OG Description</label>
                <textarea
                  value={formData.ogDescription}
                  onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                  rows="3"
                  placeholder="Leave blank to use Meta Description"
                />
              </div>

              <div className="form-group">
                <label>OG Image URL</label>
                <input
                  type="text"
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  placeholder="/uploads/og-image.jpg"
                />
              </div>

              <div className="form-group">
                <label>OG Type</label>
                <select
                  value={formData.ogType}
                  onChange={(e) => setFormData({ ...formData, ogType: e.target.value })}
                >
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="product">Product</option>
                </select>
              </div>
            </div>

            <div className="form-section" style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Advanced Settings</h3>
              
              <div className="form-group">
                <label>Canonical URL</label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://example.com/page"
                />
                <small style={{ color: '#666' }}>Leave blank to use current page URL</small>
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '24px' }}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.robotsIndex}
                    onChange={(e) => setFormData({ ...formData, robotsIndex: e.target.checked })}
                  />
                  Allow search engines to index this page
                </label>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.robotsFollow}
                    onChange={(e) => setFormData({ ...formData, robotsFollow: e.target.checked })}
                  />
                  Allow search engines to follow links
                </label>
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaSave /> Save SEO Settings
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SEOSettings;
