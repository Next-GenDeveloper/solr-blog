import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaShoppingBag,
  FaUser,
  FaTruck,
  FaCreditCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload,
  FaPrint
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);

  // Order status options
  const ORDER_STATUSES = [
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
    { value: 'processing', label: 'Processing', color: '#8b5cf6' },
    { value: 'shipped', label: 'Shipped', color: '#06b6d4' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: '#10b981' },
    { value: 'delivered', label: 'Delivered', color: '#22c55e' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    { value: 'returned', label: 'Returned', color: '#64748b' }
  ];

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/orders/stats');
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch order stats');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Format currency as PKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.color : '#64748b';
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

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.slice(-8).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="admin-page orders-page">
      <div className="page-header">
        <div>
          <h1><FaShoppingBag /> Orders Management</h1>
          <p>Manage and track customer orders</p>
        </div>
        <div className="header-stats">
          {stats && (
            <>
              <div className="stat-pill">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{stats.total || orders.length}</span>
              </div>
              <div className="stat-pill revenue">
                <span className="stat-label">Revenue</span>
                <span className="stat-value">{formatCurrency(stats.revenue)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
        {ORDER_STATUSES.slice(0, 6).map(status => {
          const count = orders.filter(o => o.orderStatus === status.value).length;
          return (
            <motion.div 
              key={status.value}
              className="quick-stat-card"
              style={{ borderLeftColor: status.color }}
              whileHover={{ y: -3 }}
              onClick={() => setStatusFilter(status.value)}
            >
              <span className="count" style={{ color: status.color }}>{count}</span>
              <span className="label">{status.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by order #, customer name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <FaShoppingBag />
                  <p>No orders found</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <motion.tr 
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                >
                  <td className="order-id">
                    <strong>#{order.orderNumber || order._id?.slice(-8).toUpperCase()}</strong>
                  </td>
                  <td>
                    <div className="customer-info">
                      <span className="name">{order.customerInfo?.fullName || order.customerInfo?.name || 'N/A'}</span>
                      <span className="location">
                        {order.shippingAddress?.city}, {order.shippingAddress?.province || order.shippingAddress?.state}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="phone">{order.customerInfo?.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="items-count">{order.items?.length || 0} items</span>
                  </td>
                  <td className="total-amount">
                    <strong>{formatCurrency(order.totalAmount || order.total)}</strong>
                  </td>
                  <td>
                    <select
                      value={order.orderStatus || 'pending'}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="status-select"
                      style={{ 
                        borderColor: getStatusColor(order.orderStatus),
                        color: getStatusColor(order.orderStatus)
                      }}
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="payment-info">
                      <span className={`payment-badge ${order.paymentStatus || 'pending'}`}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                      <span className="payment-method">{getPaymentMethodName(order.paymentMethod)}</span>
                    </div>
                  </td>
                  <td className="date">
                    {formatDate(order.createdAt)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon view" 
                        onClick={() => viewOrderDetails(order)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content order-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="header-info">
                <h2>Order #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8).toUpperCase()}</h2>
                <span 
                  className="status-badge large"
                  style={{ backgroundColor: getStatusColor(selectedOrder.orderStatus) }}
                >
                  {ORDER_STATUSES.find(s => s.value === selectedOrder.orderStatus)?.label || 'Pending'}
                </span>
              </div>
              <div className="header-actions">
                <button className="btn-icon" title="Print" onClick={() => window.print()}>
                  <FaPrint />
                </button>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="order-details-grid">
                {/* Customer Information */}
                <div className="detail-card">
                  <div className="card-title">
                    <FaUser /> Customer Information
                  </div>
                  <div className="card-content">
                    <p className="primary">{selectedOrder.customerInfo?.fullName || selectedOrder.customerInfo?.name}</p>
                    <p><FaEnvelope /> {selectedOrder.customerInfo?.email}</p>
                    <p><FaPhone /> {selectedOrder.customerInfo?.phone}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="detail-card">
                  <div className="card-title">
                    <FaTruck /> Shipping Address
                  </div>
                  <div className="card-content">
                    <p>{selectedOrder.shippingAddress?.fullAddress || selectedOrder.shippingAddress?.street}</p>
                    {selectedOrder.shippingAddress?.area && (
                      <p>{selectedOrder.shippingAddress.area}</p>
                    )}
                    <p>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province || selectedOrder.shippingAddress?.state}
                    </p>
                    {selectedOrder.shippingAddress?.postalCode && (
                      <p>Postal Code: {selectedOrder.shippingAddress.postalCode}</p>
                    )}
                    {selectedOrder.shippingAddress?.landmark && (
                      <p><FaMapMarkerAlt /> Near: {selectedOrder.shippingAddress.landmark}</p>
                    )}
                    <p>{selectedOrder.shippingAddress?.country || 'Pakistan'}</p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="detail-card">
                  <div className="card-title">
                    <FaCreditCard /> Payment Information
                  </div>
                  <div className="card-content">
                    <p><strong>Method:</strong> {getPaymentMethodName(selectedOrder.paymentMethod)}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`payment-status ${selectedOrder.paymentStatus}`}>
                        {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Order Date */}
                <div className="detail-card">
                  <div className="card-title">
                    <FaCalendarAlt /> Order Timeline
                  </div>
                  <div className="card-content">
                    <p><strong>Placed:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    {selectedOrder.updatedAt && selectedOrder.updatedAt !== selectedOrder.createdAt && (
                      <p><strong>Updated:</strong> {formatDate(selectedOrder.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items-section">
                <h3><FaShoppingBag /> Order Items ({selectedOrder.items?.length || 0})</h3>
                <div className="items-table">
                  <div className="table-header">
                    <span>Product</span>
                    <span>Price</span>
                    <span>Qty</span>
                    <span>Total</span>
                  </div>
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="table-row">
                      <span className="product-name">{item.name || 'Product'}</span>
                      <span>{formatCurrency(item.price)}</span>
                      <span>×{item.quantity}</span>
                      <span className="item-total">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal || (selectedOrder.totalAmount - (selectedOrder.shippingCost || 0)))}</span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={selectedOrder.shippingCost === 0 ? 'free' : ''}>
                    {selectedOrder.shippingCost === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingCost)}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>{formatCurrency(selectedOrder.totalAmount || selectedOrder.total)}</span>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div className="order-notes">
                  <h4>Order Notes:</h4>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="status-update-section">
                <h4>Update Order Status:</h4>
                <div className="status-buttons">
                  {ORDER_STATUSES.map(status => (
                    <button
                      key={status.value}
                      className={`status-btn ${selectedOrder.orderStatus === status.value ? 'active' : ''}`}
                      style={{ 
                        backgroundColor: selectedOrder.orderStatus === status.value ? status.color : 'transparent',
                        borderColor: status.color,
                        color: selectedOrder.orderStatus === status.value ? 'white' : status.color
                      }}
                      onClick={() => {
                        handleStatusUpdate(selectedOrder._id, status.value);
                        setSelectedOrder({ ...selectedOrder, orderStatus: status.value });
                      }}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;
