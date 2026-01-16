import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCity, 
  FaFlag, 
  FaHashtag,
  FaShoppingBag,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaUniversity,
  FaTruck,
  FaCheck,
  FaLock,
  FaShieldAlt,
  FaInfoCircle,
  FaLandmark
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

// Pakistan provinces for dropdown
const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];

// Major cities in Pakistan
const PAKISTAN_CITIES = {
  'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Gujrat'],
  'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpurkhas', 'Thatta', 'Jacobabad'],
  'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Dera Ismail Khan', 'Kohat', 'Bannu', 'Mansehra'],
  'Balochistan': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman', 'Sibi', 'Zhob'],
  'Islamabad Capital Territory': ['Islamabad'],
  'Azad Jammu & Kashmir': ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bhimber'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Chilas', 'Hunza', 'Ghizer']
};

// Payment methods
const PAYMENT_METHODS = [
  { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: FaMoneyBillWave, description: 'Pay when you receive your order', popular: true },
  { id: 'jazzcash', name: 'JazzCash', icon: FaMobileAlt, description: 'Pay via JazzCash mobile wallet' },
  { id: 'easypaisa', name: 'Easypaisa', icon: FaMobileAlt, description: 'Pay via Easypaisa mobile wallet' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: FaUniversity, description: 'Direct bank transfer' },
  { id: 'credit_card', name: 'Credit Card', icon: FaCreditCard, description: 'Visa, Mastercard, UnionPay' },
  { id: 'debit_card', name: 'Debit Card', icon: FaCreditCard, description: 'Pay via debit card' }
];

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [availableCities, setAvailableCities] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    // Customer Info
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    
    // Shipping Address
    fullAddress: '',
    area: '',
    city: '',
    province: '',
    postalCode: '',
    landmark: '',
    
    // Payment
    paymentMethod: 'cash_on_delivery',
    
    // Notes
    orderNotes: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  // Update cities when province changes
  useEffect(() => {
    if (formData.province) {
      setAvailableCities(PAKISTAN_CITIES[formData.province] || []);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.province]);
  
  // Calculate prices
  const subtotal = cart?.totalPrice || 0;
  const shippingCost = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shippingCost;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Validate Pakistani phone number
  const validatePhone = (phone) => {
    const pkPhoneRegex = /^(\+92|0)?[3][0-9]{9}$/;
    return pkPhoneRegex.test(phone.replace(/[\s-]/g, ''));
  };
  
  // Validate form
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid Pakistani phone number (03XX-XXXXXXX)';
      if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Street address is required';
      if (!formData.area.trim()) newErrors.area = 'Area/Sector is required';
      if (!formData.province) newErrors.province = 'Province is required';
      if (!formData.city) newErrors.city = 'City is required';
    }
    
    if (currentStep === 2) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle step navigation
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  // Submit order
  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        customerInfo: {
          fullName: formData.fullName,
          name: formData.fullName, // backward compatibility
          email: formData.email,
          phone: formData.phone.replace(/[\s-]/g, '')
        },
        shippingAddress: {
          fullAddress: formData.fullAddress,
          street: formData.fullAddress,
          area: formData.area,
          city: formData.city,
          province: formData.province,
          state: formData.province, // backward compatibility
          postalCode: formData.postalCode,
          zipCode: formData.postalCode, // backward compatibility
          landmark: formData.landmark,
          country: 'Pakistan'
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.orderNotes
      };
      
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const { data } = await axios.post('/api/orders', orderData, { headers });
      
      // Clear cart after successful order
      await clearCart();
      
      toast.success('Order placed successfully!');
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          order: data.data,
          orderNumber: data.data._id
        } 
      });
      
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Step indicator component
  const StepIndicator = () => (
    <div className="checkout-steps">
      {[
        { num: 1, label: 'Shipping', icon: FaTruck },
        { num: 2, label: 'Payment', icon: FaCreditCard },
        { num: 3, label: 'Review', icon: FaCheck }
      ].map((s, idx) => (
        <React.Fragment key={s.num}>
          <div 
            className={`step ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
            onClick={() => step > s.num && setStep(s.num)}
          >
            <div className="step-number">
              {step > s.num ? <FaCheck /> : <s.icon />}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
          {idx < 2 && <div className={`step-line ${step > s.num ? 'completed' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
  
  // Render shipping form (Step 1)
  const renderShippingForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="checkout-form"
    >
      <h2><FaUser /> Customer Information</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label><FaUser /> Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>
        
        <div className="form-group">
          <label><FaEnvelope /> Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label><FaPhone /> Mobile Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="03XX-XXXXXXX"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
          <small className="hint">Pakistani mobile number format</small>
        </div>
      </div>
      
      <h2><FaMapMarkerAlt /> Shipping Address</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label><FaMapMarkerAlt /> Street Address *</label>
          <input
            type="text"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            placeholder="House/Flat No., Street Name, Building"
            className={errors.fullAddress ? 'error' : ''}
          />
          {errors.fullAddress && <span className="error-text">{errors.fullAddress}</span>}
        </div>
        
        <div className="form-group">
          <label><FaMapMarkerAlt /> Area / Sector *</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g., DHA Phase 5, Gulberg III"
            className={errors.area ? 'error' : ''}
          />
          {errors.area && <span className="error-text">{errors.area}</span>}
        </div>
        
        <div className="form-group">
          <label><FaLandmark /> Nearby Landmark</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="e.g., Near Main Market"
          />
        </div>
        
        <div className="form-group">
          <label><FaFlag /> Province *</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className={errors.province ? 'error' : ''}
          >
            <option value="">Select Province</option>
            {PAKISTAN_PROVINCES.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          {errors.province && <span className="error-text">{errors.province}</span>}
        </div>
        
        <div className="form-group">
          <label><FaCity /> City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? 'error' : ''}
            disabled={!formData.province}
          >
            <option value="">Select City</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>
        
        <div className="form-group">
          <label><FaHashtag /> Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="e.g., 54000"
            maxLength="5"
          />
        </div>
      </div>
      
      <div className="form-actions">
        <Link to="/cart" className="btn btn-outline">
          <FaArrowLeft /> Back to Cart
        </Link>
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Continue to Payment
        </button>
      </div>
    </motion.div>
  );
  
  // Render payment form (Step 2)
  const renderPaymentForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="checkout-form"
    >
      <h2><FaCreditCard /> Payment Method</h2>
      
      <div className="payment-methods">
        {PAYMENT_METHODS.map(method => (
          <div
            key={method.id}
            className={`payment-option ${formData.paymentMethod === method.id ? 'selected' : ''}`}
            onClick={() => handleChange({ target: { name: 'paymentMethod', value: method.id } })}
          >
            <div className="payment-radio">
              <div className={`radio-dot ${formData.paymentMethod === method.id ? 'active' : ''}`} />
            </div>
            <div className="payment-icon">
              <method.icon />
            </div>
            <div className="payment-info">
              <h4>{method.name} {method.popular && <span className="popular-badge">Popular</span>}</h4>
              <p>{method.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {errors.paymentMethod && <span className="error-text">{errors.paymentMethod}</span>}
      
      <div className="security-notice">
        <FaShieldAlt />
        <div>
          <h4>Secure Checkout</h4>
          <p>Your payment information is protected with industry-standard encryption.</p>
        </div>
      </div>
      
      <div className="form-group full-width">
        <label>Order Notes (Optional)</label>
        <textarea
          name="orderNotes"
          value={formData.orderNotes}
          onChange={handleChange}
          placeholder="Any special instructions for delivery..."
          rows="3"
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={prevStep}>
          <FaArrowLeft /> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Review Order
        </button>
      </div>
    </motion.div>
  );
  
  // Render order review (Step 3)
  const renderOrderReview = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="checkout-form review-section"
    >
      <h2><FaCheck /> Review Your Order</h2>
      
      <div className="review-grid">
        <div className="review-card">
          <h3><FaUser /> Customer Details</h3>
          <div className="review-details">
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
          </div>
        </div>
        
        <div className="review-card">
          <h3><FaTruck /> Shipping Address</h3>
          <div className="review-details">
            <p>{formData.fullAddress}</p>
            <p>{formData.area}{formData.landmark && `, Near ${formData.landmark}`}</p>
            <p>{formData.city}, {formData.province}</p>
            {formData.postalCode && <p>Postal Code: {formData.postalCode}</p>}
            <p>Pakistan</p>
          </div>
        </div>
        
        <div className="review-card">
          <h3><FaCreditCard /> Payment Method</h3>
          <div className="review-details">
            <p>{PAYMENT_METHODS.find(m => m.id === formData.paymentMethod)?.name}</p>
          </div>
        </div>
        
        {formData.orderNotes && (
          <div className="review-card full-width">
            <h3><FaInfoCircle /> Order Notes</h3>
            <div className="review-details">
              <p>{formData.orderNotes}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="order-items-review">
        <h3><FaShoppingBag /> Order Items ({cart.totalItems} items)</h3>
        <div className="items-list">
          {cart.items.map(item => (
            <div key={item.product} className="review-item">
              <div className="item-image">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
                <span className="quantity-badge">{item.quantity}</span>
              </div>
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{formatCurrency(item.price)} × {item.quantity}</p>
              </div>
              <div className="item-total">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={prevStep}>
          <FaArrowLeft /> Back
        </button>
        <button 
          type="button" 
          className="btn btn-primary btn-large" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>Placing Order...</>
          ) : (
            <><FaLock /> Place Order - {formatCurrency(total)}</>
          )}
        </button>
      </div>
    </motion.div>
  );
  
  if (!cart || cart.items.length === 0) {
    return null;
  }
  
  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order securely</p>
        </div>
        
        <StepIndicator />
        
        <div className="checkout-content">
          <div className="checkout-main">
            <AnimatePresence mode="wait">
              {step === 1 && renderShippingForm()}
              {step === 2 && renderPaymentForm()}
              {step === 3 && renderOrderReview()}
            </AnimatePresence>
          </div>
          
          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h3><FaShoppingBag /> Order Summary</h3>
              
              <div className="summary-items">
                {cart.items.slice(0, 3).map(item => (
                  <div key={item.product} className="summary-item">
                    <div className="item-thumb">
                      <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                      <span className="qty">{item.quantity}</span>
                    </div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <p className="more-items">+{cart.items.length - 3} more items</p>
                )}
              </div>
              
              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                    {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="free-shipping-note">
                    Add {formatCurrency(5000 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            
            <div className="trust-badges">
              <div className="badge">
                <FaShieldAlt />
                <span>Secure Payment</span>
              </div>
              <div className="badge">
                <FaTruck />
                <span>Fast Delivery</span>
              </div>
              <div className="badge">
                <FaCheck />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
