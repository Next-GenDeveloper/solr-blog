import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaShoppingBag, 
  FaUser, 
  FaTruck, 
  FaCreditCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHome,
  FaPrint,
  FaWhatsapp
} from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, orderNumber } = location.state || {};
  
  // Redirect if no order data
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get payment method display name
  const getPaymentMethodName = (method) => {
    const methods = {
      'cash_on_delivery': 'Cash on Delivery',
      'jazzcash': 'JazzCash',
      'easypaisa': 'Easypaisa',
      'bank_transfer': 'Bank Transfer',
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card'
    };
    return methods[method] || method;
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  // Generate WhatsApp message
  const handleWhatsApp = () => {
    const message = `Hi! I just placed an order #${orderNumber?.slice(-8).toUpperCase()}. Order total: ${formatCurrency(order?.totalAmount || 0)}`;
    const phoneNumber = '923001234567'; // Replace with actual business WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  if (!order) {
    return null;
  }
  
  return (
    <div className="order-confirmation-page">
      <div className="container">
        {/* Success Animation */}
        <motion.div
          className="success-header"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <FaCheckCircle />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Order Placed Successfully!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Thank you for your purchase. Your order has been received and is being processed.
          </motion.p>
          
          <motion.div
            className="order-number"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span>Order Number:</span>
            <strong>#{orderNumber?.slice(-8).toUpperCase()}</strong>
          </motion.div>
        </motion.div>
        
        {/* Order Details */}
        <motion.div
          className="order-details-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Customer Info */}
          <div className="detail-card">
            <div className="card-header">
              <FaUser />
              <h3>Customer Information</h3>
            </div>
            <div className="card-content">
              <p className="name">{order.customerInfo?.fullName || order.customerInfo?.name}</p>
              <p><FaEnvelope /> {order.customerInfo?.email}</p>
              <p><FaPhone /> {order.customerInfo?.phone}</p>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="detail-card">
            <div className="card-header">
              <FaTruck />
              <h3>Shipping Address</h3>
            </div>
            <div className="card-content">
              <p><FaMapMarkerAlt /> {order.shippingAddress?.fullAddress || order.shippingAddress?.street}</p>
              {order.shippingAddress?.area && <p>{order.shippingAddress.area}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.province || order.shippingAddress?.state}</p>
              {order.shippingAddress?.postalCode && <p>Postal Code: {order.shippingAddress.postalCode}</p>}
              <p>{order.shippingAddress?.country || 'Pakistan'}</p>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="detail-card">
            <div className="card-header">
              <FaCreditCard />
              <h3>Payment Method</h3>
            </div>
            <div className="card-content">
              <p className="payment-method">{getPaymentMethodName(order.paymentMethod)}</p>
              <p className="payment-status">
                <span className={`status ${order.paymentStatus || 'pending'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                </span>
              </p>
            </div>
          </div>
          
          {/* Order Status */}
          <div className="detail-card">
            <div className="card-header">
              <FaShoppingBag />
              <h3>Order Status</h3>
            </div>
            <div className="card-content">
              <p className="order-status">
                <span className={`status ${order.orderStatus || 'pending'}`}>
                  {order.orderStatus?.replace(/_/g, ' ') || 'Pending'}
                </span>
              </p>
              <p className="order-date">
                Placed on: {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Order Items */}
        <motion.div
          className="order-items-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2><FaShoppingBag /> Order Items</h2>
          
          <div className="items-table">
            <div className="table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
            </div>
            
            {order.items?.map((item, index) => (
              <div key={index} className="table-row">
                <div className="product-info">
                  <span className="product-name">{item.name || 'Product'}</span>
                </div>
                <span className="price">{formatCurrency(item.price)}</span>
                <span className="quantity">×{item.quantity}</span>
                <span className="total">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal || order.totalAmount - (order.shippingCost || 0))}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span className={order.shippingCost === 0 ? 'free' : ''}>
                {order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}
              </span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Delivery Info */}
        <motion.div
          className="delivery-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="info-icon">
            <FaTruck />
          </div>
          <div className="info-content">
            <h3>Estimated Delivery</h3>
            <p>Your order will be delivered within 3-5 business days.</p>
            <p>You will receive an SMS/email notification when your order is out for delivery.</p>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button className="btn btn-outline" onClick={handlePrint}>
            <FaPrint /> Print Receipt
          </button>
          <button className="btn btn-whatsapp" onClick={handleWhatsApp}>
            <FaWhatsapp /> Contact via WhatsApp
          </button>
          <Link to="/shop" className="btn btn-primary">
            <FaShoppingBag /> Continue Shopping
          </Link>
          <Link to="/" className="btn btn-secondary">
            <FaHome /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
