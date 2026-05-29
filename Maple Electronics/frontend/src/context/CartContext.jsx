import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!isAuthenticated || !token) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }

    setLoading(true);
    try {
      const data = await api.getCart(token);
      setCart(data);
    } catch {
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    if (!token) throw new Error('Please login first');
    const data = await api.addToCart(token, productId, quantity);
    setCart(data);
  };

  const updateItem = async (productId, quantity) => {
    const data = await api.updateCartItem(token, productId, quantity);
    setCart(data);
  };

  const removeItem = async (productId) => {
    const data = await api.removeCartItem(token, productId);
    setCart(data);
  };

  const clearCart = async () => {
    await api.clearCart(token);
    setCart({ items: [], totalAmount: 0 });
  };

  useEffect(() => {
    loadCart();
  }, [token, isAuthenticated]);

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        loadCart,
        addItem,
        updateItem,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);