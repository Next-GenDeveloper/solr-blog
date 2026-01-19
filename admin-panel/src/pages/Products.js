import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaSearch, 
  FaFilter, FaBox, FaEye, FaChevronLeft, FaChevronRight,
  FaSort, FaCheckCircle, FaTimesCircle, FaTags, FaWarehouse,
  FaDollarSign, FaBarcode, FaLayerGroup
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const productsPerPage = 12;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: 'Solar Panels',
    stock: '',
    sku: '',
    isActive: true,
    // SEO Fields
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
    canonicalUrl: '',
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'Solar Panels',
    'Inverters',
    'Batteries',
    'Accessories',
    'Mounting Systems'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/all');
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesStatus = !statusFilter || 
                           (statusFilter === 'active' && product.isActive) ||
                           (statusFilter === 'inactive' && !product.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      selectedImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post('/api/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created successfully');
      }

      fetchProducts();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice || '',
      category: product.category,
      stock: product.stock,
      sku: product.sku,
      isActive: product.isActive,
      // SEO Fields
      slug: product.slug || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      keywords: product.keywords || '',
      ogImage: product.ogImage || '',
      canonicalUrl: product.canonicalUrl || '',
    });
    if (product.images && product.images.length > 0) {
      setImagePreviews(product.images);
    }
    setShowModal(true);
  };

  const handlePreview = (product) => {
    setPreviewProduct(product);
    setShowPreviewModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setFormData({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      category: 'Solar Panels',
      stock: '',
      sku: '',
      isActive: true,
      // SEO Fields
      slug: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '',
      canonicalUrl: '',
    });
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'out-of-stock' };
    if (stock <= 10) return { label: 'Low Stock', class: 'low-stock' };
    return { label: 'In Stock', class: 'in-stock' };
  };

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page-modern">
      {/* Stats Cards */}
      <div className="products-stats-grid">
        <motion.div 
          className="stat-card-modern stat-total"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon-wrapper">
            <FaBox />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalProducts}</span>
            <span className="stat-label">Total Products</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card-modern stat-active"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon-wrapper">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{activeProducts}</span>
            <span className="stat-label">Active Products</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card-modern stat-warning"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon-wrapper">
            <FaWarehouse />
          </div>
          <div className="stat-content">
            <span className="stat-value">{lowStockProducts}</span>
            <span className="stat-label">Low Stock</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card-modern stat-danger"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-icon-wrapper">
            <FaTimesCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{outOfStockProducts}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </motion.div>
      </div>

      {/* Header Section */}
      <div className="products-header-modern">
        <div className="header-left">
          <h1>Product Management</h1>
          <p>Manage your product inventory efficiently</p>
        </div>
        <motion.button 
          className="add-product-btn"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus /> Add New Product
        </motion.button>
      </div>

      {/* Filters & Search Section */}
      <div className="products-toolbar">
        <div className="search-box-modern">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaTags className="filter-icon" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <FaSort className="filter-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date Added</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FaLayerGroup />
            </button>
            <button 
              className={viewMode === 'table' ? 'active' : ''} 
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <FaBox />
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>Showing {paginatedProducts.length} of {filteredProducts.length} products</span>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <motion.div 
          className="products-grid-modern"
          layout
        >
          <AnimatePresence>
            {paginatedProducts.map((product) => (
              <motion.div 
                key={product._id}
                className="product-card-modern"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="product-image-container">
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={product.name}
                  />
                  <div className="product-overlay">
                    <button className="overlay-btn preview" onClick={() => handlePreview(product)}>
                      <FaEye />
                    </button>
                    <button className="overlay-btn edit" onClick={() => handleEdit(product)}>
                      <FaEdit />
                    </button>
                    <button className="overlay-btn delete" onClick={() => handleDelete(product._id)}>
                      <FaTrash />
                    </button>
                  </div>
                  <span className={`product-status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="product-card-content">
                  <span className="product-category-tag">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-meta">
                    <span className="product-sku"><FaBarcode /> {product.sku}</span>
                    <span className={`stock-badge ${getStockStatus(product.stock).class}`}>
                      {getStockStatus(product.stock).label}
                    </span>
                  </div>
                  <div className="product-pricing">
                    <span className="current-price">Rs. {product.price?.toLocaleString()}</span>
                    {product.comparePrice > product.price && (
                      <span className="compare-price">Rs. {product.comparePrice?.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="product-stock-bar">
                    <div 
                      className="stock-fill" 
                      style={{ width: `${Math.min(product.stock, 100)}%` }}
                    ></div>
                    <span>{product.stock} in stock</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="products-table-modern">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th onClick={() => toggleSort('category')} className="sortable">
                  Category <FaSort />
                </th>
                <th onClick={() => toggleSort('price')} className="sortable">
                  Price <FaSort />
                </th>
                <th onClick={() => toggleSort('stock')} className="sortable">
                  Stock <FaSort />
                </th>
                <th>SKU</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <motion.tr 
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="product-cell">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/50?text=No+Image'} 
                      alt={product.name}
                      className="table-product-img"
                    />
                    <span>{product.name}</span>
                  </td>
                  <td><span className="category-badge">{product.category}</span></td>
                  <td className="price-cell">
                    <span className="price">Rs. {product.price?.toLocaleString()}</span>
                    {product.comparePrice > product.price && (
                      <span className="compare">Rs. {product.comparePrice?.toLocaleString()}</span>
                    )}
                  </td>
                  <td>
                    <span className={`stock-indicator ${getStockStatus(product.stock).class}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.sku}</td>
                  <td>
                    <span className={`status-pill ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" onClick={() => handlePreview(product)} title="Preview">
                        <FaEye />
                      </button>
                      <button className="action-btn edit" onClick={() => handleEdit(product)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(product._id)} title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-modern">
          <button 
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <FaChevronLeft />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay-modern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="modal-content-modern"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-modern">
                <div className="modal-title">
                  <span className="modal-icon">
                    {editingProduct ? <FaEdit /> : <FaPlus />}
                  </span>
                  <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                </div>
                <button className="close-btn-modern" onClick={handleCloseModal}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form-modern">
                <div className="form-grid">
                  <div className="form-section">
                    <h3><FaBox /> Basic Information</h3>
                    
                    <div className="form-group-modern">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="form-row-modern">
                      <div className="form-group-modern">
                        <label>Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-modern">
                        <label>SKU *</label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="SKU-001"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group-modern">
                      <label>Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product..."
                        rows="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3><FaDollarSign /> Pricing & Inventory</h3>
                    
                    <div className="form-row-modern">
                      <div className="form-group-modern">
                        <label>Price (Rs.) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="form-group-modern">
                        <label>Compare Price (Rs.)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.comparePrice}
                          onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="form-group-modern">
                      <label>Stock Quantity *</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div className="form-group-modern checkbox-modern">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        Product is active and visible to customers
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-section full-width">
                  <h3><FaImage /> Product Images</h3>
                  <p className="section-hint">Upload up to 5 high-quality product images</p>
                  
                  <div className="image-upload-modern">
                    <input
                      type="file"
                      id="product-images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="product-images" className="upload-zone">
                      <FaImage className="upload-icon" />
                      <span>Drag & drop images or click to browse</span>
                      <span className="upload-hint">{imagePreviews.length}/5 images selected</span>
                    </label>

                    {imagePreviews.length > 0 && (
                      <div className="image-previews-modern">
                        {imagePreviews.map((preview, index) => (
                          <motion.div 
                            key={index} 
                            className="preview-item"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-preview"
                              onClick={() => removeImage(index)}
                            >
                              <FaTimes />
                            </button>
                            {index === 0 && <span className="primary-badge">Primary</span>}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SEO Section */}
                <div className="form-section full-width" style={{ marginTop: '20px', background: '#f8f9fa', padding: '24px', borderRadius: '12px' }}>
                  <h3 style={{ marginBottom: '16px', color: '#333' }}>🔍 SEO Settings</h3>
                  <p className="section-hint" style={{ marginBottom: '20px' }}>Optimize your product for search engines</p>

                  <div className="form-row">
                    <div className="form-group-modern">
                      <label>Slug (URL-friendly)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="auto-generated-from-name"
                      />
                      <span className="input-hint">Leave blank to auto-generate from product name</span>
                    </div>

                    <div className="form-group-modern">
                      <label>Meta Title (60 chars max)</label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        maxLength="60"
                        placeholder="SEO-optimized title"
                      />
                      <span className="input-hint">{formData.metaTitle.length}/60 characters</span>
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label>Meta Description (160 chars max)</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      maxLength="160"
                      rows="3"
                      placeholder="Brief description for search engines"
                    />
                    <span className="input-hint">{formData.metaDescription.length}/160 characters</span>
                  </div>

                  <div className="form-group-modern">
                    <label>Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="solar panel, renewable energy, 500W"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group-modern">
                      <label>OG Image URL (optional)</label>
                      <input
                        type="text"
                        value={formData.ogImage}
                        onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                        placeholder="/uploads/products/image.jpg"
                      />
                      <span className="input-hint">Leave blank to use first product image</span>
                    </div>

                    <div className="form-group-modern">
                      <label>Canonical URL (optional)</label>
                      <input
                        type="text"
                        value={formData.canonicalUrl}
                        onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                        placeholder="https://example.com/products/slug"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-actions-modern">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && previewProduct && (
          <motion.div 
            className="modal-overlay-modern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              className="preview-modal-modern"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-preview" onClick={() => setShowPreviewModal(false)}>
                <FaTimes />
              </button>
              <div className="preview-content">
                <div className="preview-images">
                  <img 
                    src={previewProduct.images?.[0] || 'https://via.placeholder.com/400?text=No+Image'} 
                    alt={previewProduct.name}
                    className="main-preview-image"
                  />
                  {previewProduct.images?.length > 1 && (
                    <div className="preview-thumbnails">
                      {previewProduct.images.slice(0, 4).map((img, i) => (
                        <img key={i} src={img} alt={`Thumbnail ${i + 1}`} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="preview-details">
                  <span className="preview-category">{previewProduct.category}</span>
                  <h2>{previewProduct.name}</h2>
                  <div className="preview-pricing">
                    <span className="preview-price">Rs. {previewProduct.price?.toLocaleString()}</span>
                    {previewProduct.comparePrice > previewProduct.price && (
                      <span className="preview-compare">Rs. {previewProduct.comparePrice?.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="preview-description">{previewProduct.description}</p>
                  <div className="preview-info-grid">
                    <div className="info-item">
                      <span className="info-label">SKU</span>
                      <span className="info-value">{previewProduct.sku}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Stock</span>
                      <span className="info-value">{previewProduct.stock} units</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status</span>
                      <span className={`info-value status ${previewProduct.isActive ? 'active' : ''}`}>
                        {previewProduct.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Rating</span>
                      <span className="info-value">{previewProduct.rating || 0} / 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
