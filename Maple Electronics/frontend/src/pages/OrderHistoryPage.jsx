import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

const OrderHistoryPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await api.getMyOrders(token);
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

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
        <h2 className="page-title">Order History</h2>

        {loading ? (
          <div className="empty-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found.</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-head">
                  <div>
                    <strong>Order ID:</strong> {order._id}
                  </div>
                  <div className={`status-pill status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                </div>
                <p><strong>Total:</strong> ${order.totalAmount}</p>
                <p><strong>Shipping:</strong> {order.shippingAddress}</p>
                <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <span>{item.productId?.name || 'Product'}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.priceAtPurchase}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistoryPage;