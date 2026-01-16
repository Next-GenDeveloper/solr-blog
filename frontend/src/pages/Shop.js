import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaStar, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  const categories = ['All', 'Solar Panels', 'Inverters', 'Batteries', 'Accessories', 'Mounting Systems'];

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?page=${currentPage}&limit=12`;
      
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      if (priceRange.min) {
        url += `&minPrice=${priceRange.min}`;
      }

      if (priceRange.max) {
        url += `&maxPrice=${priceRange.max}`;
      }

      const { data } = await axios.get(url);
      setProducts(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      await addToCart(product, 1);
    }
  };

  return (
    <div className="shop-page">
      {/* Hero Section */}
      <section className="shop-hero">
        <div className="shop-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Solar Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse our premium selection of solar energy products
          </motion.p>
        </div>
      </section>

      <section className="shop-content section-padding">
        <div className="container">
          {/* Filters */}
          <div className="shop-filters">
            <motion.div
              className="search-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <form onSubmit={handleSearch}>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
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
              <FaFilter /> <span>Filter by Category:</span>
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

          {/* Products Grid */}
          {loading ? (
            <div className="loader"></div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    className="product-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                  >
                    <Link to={`/product/${product._id}`}>
                      <div className="product-image">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Solar+Product'}
                          alt={product.name}
                        />
                        {product.comparePrice > product.price && (
                          <span className="discount-badge">
                            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="featured-badge">Featured</span>
                        )}
                        {product.images && product.images.length > 1 && (
                          <span className="image-count-badge">
                            📷 {product.images.length}
                          </span>
                        )}
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p className="product-description">
                          {product.description.length > 80 
                            ? product.description.substring(0, 80) + '...' 
                            : product.description}
                        </p>
                        <div className="product-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < product.rating ? 'star-filled' : 'star-empty'}
                            />
                          ))}
                          <span>({product.numReviews})</span>
                        </div>
                        <div className="product-footer">
                          <div className="product-pricing">
                            {product.comparePrice > product.price && (
                              <span className="compare-price">${product.comparePrice}</span>
                            )}
                            <span className="product-price">${product.price}</span>
                          </div>
                          {product.stock > 0 ? (
                            <motion.button
                              className="btn-add-to-cart"
                              onClick={(e) => handleAddToCart(e, product)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaShoppingCart /> Add
                            </motion.button>
                          ) : (
                            <span className="stock-status out-of-stock">Out of Stock</span>
                          )}
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
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
