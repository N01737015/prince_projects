import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [tab, setTab] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [v, p, o, c] = await Promise.all([
        api.getVendors(token),
        api.getAdminProducts(token),
        api.getAllOrders(token),
        api.getCategories()
      ]);
      setVendors(v);
      setProducts(p);
      setOrders(o);
      setCategories(c);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleVendorStatus = async (id, status) => {
    try {
      await api.updateVendorStatus(token, id, status);
      setVendors(vendors.map((v) =>
        v._id === id ? { ...v, vendorStatus: status } : v
      ));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleProductStatus = async (id, status) => {
    try {
      await api.updateProductStatus(token, id, status);
      setProducts(products.map((p) =>
        p._id === id ? { ...p, status } : p
      ));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(token, id, status);
      setOrders(orders.map((o) =>
        o._id === id ? { ...o, status } : o
      ));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(token, id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const cat = await api.createCategory(token, { name: newCategory, description: catDesc });
      setCategories([...categories, cat]);
      setNewCategory('');
      setCatDesc('');
      setMessage('Category created successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Layout searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} activeCategory="all" onCategoryChange={() => {}} showCategoryNav={false}>
      <div className="container page-section">
        <h2 className="page-title">Admin Panel</h2>

        <div className="dashboard-tabs">
          {[
            { key: 'vendors', label: 'Vendors' },
            { key: 'products', label: 'Products' },
            { key: 'orders', label: 'Orders' },
            { key: 'categories', label: 'Categories' }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={tab === key ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <>
            {tab === 'vendors' && (
              <div className="admin-table-wrap">
                <h3 style={{ marginBottom: '16px' }}>Vendor Accounts ({vendors.length})</h3>
                {vendors.length === 0 ? (
                  <div className="empty-state">No vendors registered yet.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Store</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((v) => (
                        <tr key={v._id}>
                          <td>{v.name}</td>
                          <td>{v.email}</td>
                          <td>{v.storeName || '-'}</td>
                          <td>
                            <span className={'status-pill status-' + v.vendorStatus.toLowerCase()}>
                              {v.vendorStatus}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {v.vendorStatus !== 'APPROVED' && (
                                <button
                                  className="primary-button"
                                  style={{ padding: '6px 14px', width: 'auto' }}
                                  onClick={() => handleVendorStatus(v._id, 'APPROVED')}
                                >
                                  Approve
                                </button>
                              )}
                              {v.vendorStatus !== 'REJECTED' && (
                                <button
                                  className="danger-button"
                                  onClick={() => handleVendorStatus(v._id, 'REJECTED')}
                                >
                                  Reject
                                </button>
                              )}
                              {v.vendorStatus !== 'PENDING' && (
                                <button
                                  className="secondary-button"
                                  onClick={() => handleVendorStatus(v._id, 'PENDING')}
                                >
                                  Suspend
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tab === 'products' && (
              <div className="admin-table-wrap">
                <h3 style={{ marginBottom: '16px' }}>All Products ({products.length})</h3>
                {products.length === 0 ? (
                  <div className="empty-state">No products found.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td>{p.name}</td>
                          <td>{p.brand}</td>
                          <td>${p.price}</td>
                          <td>{p.stock}</td>
                          <td>{p.categoryId?.name || '-'}</td>
                          <td>
                            <span className={'status-pill status-' + p.status.toLowerCase()}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {p.status !== 'APPROVED' && (
                                <button
                                  className="primary-button"
                                  style={{ padding: '6px 14px', width: 'auto' }}
                                  onClick={() => handleProductStatus(p._id, 'APPROVED')}
                                >
                                  Approve
                                </button>
                              )}
                              {p.status !== 'REJECTED' && (
                                <button
                                  className="danger-button"
                                  onClick={() => handleProductStatus(p._id, 'REJECTED')}
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                className="danger-button"
                                onClick={() => handleDeleteProduct(p._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="admin-table-wrap">
                <h3 style={{ marginBottom: '16px' }}>All Orders ({orders.length})</h3>
                {orders.length === 0 ? (
                  <div className="empty-state">No orders placed yet.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Tracking</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td style={{ fontSize: '12px' }}>{o._id}</td>
                          <td style={{ fontSize: '12px' }}>{o.userId}</td>
                          <td>${o.totalAmount}</td>
                          <td>{o.trackingNumber}</td>
                          <td>
                            <span className={'status-pill status-' + o.status.toLowerCase()}>
                              {o.status}
                            </span>
                          </td>
                          <td>
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatus(o._id, e.target.value)}
                              style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid #e6e8ee' }}
                            >
                              {['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tab === 'categories' && (
              <div>
                <div className="auth-card" style={{ maxWidth: '480px', marginBottom: '32px' }}>
                  <h3>Add New Category</h3>
                  <form onSubmit={handleAddCategory} className="auth-form" style={{ marginTop: '16px' }}>
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                    />
                    {message && (
                      <div className={message.includes('success') ? 'info-box' : 'error-box'}>
                        {message}
                      </div>
                    )}
                    <button type="submit">Create Category</button>
                  </form>
                </div>

                <h3 style={{ marginBottom: '16px' }}>Existing Categories ({categories.length})</h3>
                {categories.length === 0 ? (
                  <div className="empty-state">No categories yet.</div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c._id}>
                            <td>{c.name}</td>
                            <td>{c.description || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
