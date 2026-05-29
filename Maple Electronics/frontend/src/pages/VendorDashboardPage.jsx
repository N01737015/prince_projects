import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

const EMPTY_FORM = {
  name: '',
  brand: '',
  price: '',
  stock: '',
  categoryId: '',
  description: '',
  specs: ''
};

const VendorDashboardPage = () => {
  const { token } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.getMyProducts(token),
        api.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      let parsedSpecs = {};
      if (form.specs.trim()) {
        try {
          parsedSpecs = JSON.parse(form.specs);
        } catch {
          setMessage('Specs must be valid JSON. Example: {"RAM": "16GB", "Storage": "512GB"}');
          return;
        }
      }

      await api.createProduct(token, {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
        description: form.description,
        specs: parsedSpecs
      });
      setMessage('Product submitted for admin approval.');
      setForm(EMPTY_FORM);
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(token, id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} activeCategory="all" onCategoryChange={() => {}} showCategoryNav={false}>
      <div className="container page-section">
        <h2 className="page-title">Vendor Dashboard</h2>

        <div className="dashboard-tabs">
          <button
            className={tab === 'products' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setTab('products')}
          >
            My Products
          </button>
          <button
            className={tab === 'add' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setTab('add')}
          >
            Add Product
          </button>
        </div>

        {tab === 'products' && (
          <div>
            {loading ? (
              <div className="empty-state">Loading...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">No products yet. Add your first product.</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>{p.brand}</td>
                        <td>${p.price}</td>
                        <td>{p.stock}</td>
                        <td>
                          <span className={'status-pill status-' + p.status.toLowerCase()}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="danger-button"
                            onClick={() => handleDelete(p._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'add' && (
          <div className="auth-card" style={{ maxWidth: '640px' }}>
            <h3>Add New Product</h3>
            <p style={{ color: '#6d7583', marginBottom: '20px', fontSize: '14px' }}>
              Products are submitted for admin approval before going live.
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="number"
                  placeholder="Price ($)"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                style={{ padding: '14px 18px', border: '1px solid #e6e8ee', borderRadius: '18px' }}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ minHeight: '80px', padding: '14px 18px', border: '1px solid #e6e8ee', borderRadius: '18px' }}
              />
              <textarea
                placeholder={'Specifications (JSON format): {"RAM": "16GB", "Storage": "512GB"}'}
                value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                style={{ minHeight: '80px', padding: '14px 18px', border: '1px solid #e6e8ee', borderRadius: '18px' }}
              />
              {message && (
                <div className={message.includes('success') || message.includes('approval') ? 'info-box' : 'error-box'}>
                  {message}
                </div>
              )}
              <button type="submit">Submit Product</button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VendorDashboardPage;
