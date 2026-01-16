import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to checkout page (to be implemented)
    navigate('/checkout');
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container section-padding">
          <motion.div
            className="empty-cart-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaShoppingCart size={80} />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/shop">
              <button className="btn btn-primary">Browse Products</button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container section-padding">
        <Link to="/shop" className="back-link">
          <FaArrowLeft /> Continue Shopping
        </Link>

        <motion.div
          className="cart-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Shopping Cart</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </motion.div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item, index) => (
              <motion.div
                key={item.product}
                className="cart-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="item-image">
                  <img 
                    src={item.image || 'https://via.placeholder.com/150'} 
                    alt={item.name} 
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price}</p>
                </div>
                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product)}
                >
                  <FaTrash />
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            {!user && (
              <p className="login-message">
                Please <Link to="/login">login</Link> to complete your purchase
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
