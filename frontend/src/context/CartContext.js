import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      // Load guest cart from localStorage
      loadGuestCart();
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuestCart = () => {
    const guestCart = localStorage.getItem('guestCart');
    if (guestCart) {
      const parsedCart = JSON.parse(guestCart);
      setCart(parsedCart);
    } else {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  };

  const saveGuestCart = (updatedCart) => {
    localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const calculateTotals = (items) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (user && token) {
        // Logged-in user: add to database
        const { data } = await axios.post(
          '/api/cart/items',
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(data.data);
        toast.success('Added to cart!');
      } else {
        // Guest user: add to localStorage
        const existingItemIndex = cart.items.findIndex(
          item => item.product === product._id
        );

        let updatedItems;
        if (existingItemIndex > -1) {
          updatedItems = [...cart.items];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          updatedItems = [
            ...cart.items,
            {
              product: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '',
              quantity,
            }
          ];
        }

        const totals = calculateTotals(updatedItems);
        const updatedCart = { items: updatedItems, ...totals };
        saveGuestCart(updatedCart);
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (user && token) {
        const { data } = await axios.put(
          `/api/cart/items/${productId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(data.data);
      } else {
        const updatedItems = cart.items.map(item =>
          item.product === productId ? { ...item, quantity } : item
        );
        const totals = calculateTotals(updatedItems);
        const updatedCart = { items: updatedItems, ...totals };
        saveGuestCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user && token) {
        const { data } = await axios.delete(
          `/api/cart/items/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(data.data);
        toast.success('Removed from cart');
      } else {
        const updatedItems = cart.items.filter(item => item.product !== productId);
        const totals = calculateTotals(updatedItems);
        const updatedCart = { items: updatedItems, ...totals };
        saveGuestCart(updatedCart);
        toast.success('Removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      if (user && token) {
        await axios.delete('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      } else {
        localStorage.removeItem('guestCart');
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: user && token ? fetchCart : loadGuestCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
