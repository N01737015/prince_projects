import { useState } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, updateItem, removeItem, clearCart, loadCart } = useCart();
  const { token } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    try {
      if (!shippingAddress.trim()) {
        setMessage('Please enter a shipping address.');
        return;
      }

      await api.createOrder(token, shippingAddress);
      await loadCart();
      setShippingAddress('');
      setMessage('Order placed successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Layout
      searchTerm=""
      setSearchTerm={() => {}}
      onSearch={() => {}}
      activeCategory="all"
      onCategoryChange={() => {}}
      showCategoryNav={false}
    >
      <div className="container page-section">
        <h2 className="page-title">Your Cart</h2>

        {!cart.items?.length ? (
          <div className="empty-state">Your cart is empty.</div>
        ) : (
          <>
            <div className="cart-list">
              {cart.items.map((item) => (
                <div className="cart-item" key={item.productId}>
                  <div>
                    <h4>{item.productId?.name || item.productId}</h4>
                    <p>${item.priceAtAdd} each</p>
                  </div>

                  <div className="cart-actions">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.productId?._id || item.productId, Number(e.target.value))
                      }
                    />
                    <button
                      className="danger-button"
                      onClick={() => removeItem(item.productId?._id || item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: ${cart.totalAmount || 0}</h3>
              <textarea
                placeholder="Enter shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
              <div className="cart-summary-actions">
                <button className="secondary-button" onClick={clearCart}>Clear Cart</button>
                <button className="primary-button" onClick={handleCheckout}>Checkout</button>
              </div>
              {message && <div className="info-box">{message}</div>}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;