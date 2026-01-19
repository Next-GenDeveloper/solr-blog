import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaCheck, FaMinus, FaPlus, FaUser, FaThumbsUp, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await axios.get(`/api/reviews/product/${id}`);
      setReviews(data.data);
      setRatingDistribution(data.ratingDistribution);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post('/api/reviews', {
        productId: id,
        ...reviewForm
      });
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchReviews();
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    try {
      await axios.post(`/api/reviews/${reviewId}/helpful`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to record vote');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateTotalReviews = () => {
    return Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
  };

  const getRatingPercentage = (stars) => {
    const total = calculateTotalReviews();
    return total > 0 ? (ratingDistribution[stars] / total) * 100 : 0;
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container section-padding">
        <div className="product-detail-grid">
          {/* Product Images */}
          <motion.div
            className="product-images"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="main-image-container">
              <img
                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x400?text=Solar+Product'}
                alt={product.name}
                className="main-product-image"
              />
              {product.images && product.images.length > 1 && (
                <div className="image-navigation">
                  <button 
                    className="nav-btn prev-btn"
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                  >
                    ‹
                  </button>
                  <button 
                    className="nav-btn next-btn"
                    onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                  >
                    ›
                  </button>
                  <div className="image-counter">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-wrapper ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="product-details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="product-category">{product.category}</span>
            <h1>{product.name}</h1>
            
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < product.rating ? 'star-filled' : 'star-empty'}
                />
              ))}
              <span>({product.numReviews} reviews)</span>
            </div>

            <div className="product-pricing">
              {product.comparePrice > product.price && (
                <span className="compare-price">Rs. {product.comparePrice?.toLocaleString()}</span>
              )}
              <span className="product-price">Rs. {product.price?.toLocaleString()}</span>
              {product.comparePrice > product.price && (
                <span className="discount-badge">
                  Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Key Features:</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <FaCheck className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">
                  <FaCheck /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange('decrement')}>
                    <FaMinus />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange('increment')}>
                    <FaPlus />
                  </button>
                </div>
                <button className="btn btn-primary add-to-cart" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div className="product-specifications">
                <h3>Specifications:</h3>
                <table>
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className="spec-key">{spec.key}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Customer Reviews Section */}
        <motion.div 
          className="reviews-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {user && (
              <button 
                className="btn btn-primary write-review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Summary */}
          <div className="reviews-summary">
            <div className="rating-overview">
              <div className="average-rating">
                <span className="rating-number">{product.rating?.toFixed(1) || '0.0'}</span>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(product.rating || 0) ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
                <span className="total-reviews">Based on {product.numReviews || 0} reviews</span>
              </div>
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="rating-bar-row">
                    <span className="star-label">{stars} star</span>
                    <div className="rating-bar">
                      <div 
                        className="rating-bar-fill"
                        style={{ width: `${getRatingPercentage(stars)}%` }}
                      ></div>
                    </div>
                    <span className="rating-count">{ratingDistribution[stars]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div 
                className="review-form-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <form onSubmit={handleSubmitReview} className="review-form">
                  <h3>Share Your Experience</h3>
                  
                  <div className="form-group rating-input">
                    <label>Your Rating</label>
                    <div className="star-rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= reviewForm.rating ? 'star-active' : 'star-inactive'}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reviewTitle">Review Title</label>
                    <input
                      type="text"
                      id="reviewTitle"
                      placeholder="Summarize your experience..."
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reviewComment">Your Review</label>
                    <textarea
                      id="reviewComment"
                      placeholder="Tell us about your experience with this product..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      rows={5}
                      maxLength={1000}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary submit-review-btn"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          <div className="reviews-list">
            {reviewsLoading ? (
              <div className="reviews-loading">
                <div className="loader"></div>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div 
                  key={review._id} 
                  className="review-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.user?.avatar ? (
                          <img src={review.user.avatar} alt={review.user.name} />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <div className="reviewer-details">
                        <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                        {review.isVerifiedPurchase && (
                          <span className="verified-badge">
                            <FaCheckCircle /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>

                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>

                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-comment">{review.comment}</p>

                  <div className="review-actions">
                    <button 
                      className="helpful-btn"
                      onClick={() => handleHelpfulVote(review._id)}
                    >
                      <FaThumbsUp /> Helpful ({review.helpfulVotes})
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
                {!user && (
                  <p className="login-prompt">Please login to write a review.</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
