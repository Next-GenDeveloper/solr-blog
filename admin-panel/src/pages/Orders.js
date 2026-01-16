import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Orders Management</h1>
          <p>Manage customer orders</p>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerInfo.name}</td>
                <td>{order.items.length} items</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => viewOrderDetails(order)}>
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.orderNumber}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-form">
              <div className="order-details">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>

                <h3 style={{ marginTop: '1.5rem' }}>Order Items</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={{ padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                    <p><strong>{item.name}</strong></p>
                    <p>Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}

                <h3 style={{ marginTop: '1.5rem' }}>Order Summary</h3>
                <p><strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}</p>
                <p><strong>Tax:</strong> ${selectedOrder.tax.toFixed(2)}</p>
                <p><strong>Shipping:</strong> ${selectedOrder.shippingCost.toFixed(2)}</p>
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>

                {selectedOrder.shippingAddress && (
                  <>
                    <h3 style={{ marginTop: '1.5rem' }}>Shipping Address</h3>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;
