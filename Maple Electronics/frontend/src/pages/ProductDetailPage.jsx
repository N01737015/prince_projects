import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { api } from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prod, recs] = await Promise.all([
          api.getProductById(id),
          api.getRecommendations(id)
        ]);
        setProduct(prod);
        setRecommendations(recs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addItem(product._id, quantity);
      setMessage('Added to cart successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <Layout searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} activeCategory="all" onCategoryChange={() => {}} showCategoryNav={false}>
        <div className="container page-section">
          <div className="empty-state">Loading product...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} activeCategory="all" onCategoryChange={() => {}} showCategoryNav={false}>
        <div className="container page-section">
          <div className="empty-state">Product not found.</div>
        </div>
      </Layout>
    );
  }

  const categoryName =
    typeof product.categoryId === 'object' ? product.categoryId?.name : 'Electronics';
  const vendorName =
    typeof product.vendorId === 'object'
      ? product.vendorId?.storeName || product.vendorId?.name
      : 'Seller';

  return (
    <Layout searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} activeCategory="all" onCategoryChange={() => {}} showCategoryNav={false}>
      <div className="container page-section">
        <button className="back-link" onClick={() => navigate(-1)}>Back to Products</button>

        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="product-detail-img" />
            ) : (
              <div className="product-image-placeholder large">{product.brand ? product.brand.charAt(0) : 'P'}</div>
            )}
          </div>

          <div className="product-detail-info">
            <div className="product-category">{categoryName}</div>
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-brand">Brand: {product.brand}</p>
            <p className="product-brand">Sold by: {vendorName}</p>
            <p className="product-brand">In Stock: {product.stock} units</p>

            <div className="product-detail-price">${product.price}</div>

            {product.description && (
              <p className="product-description">{product.description}</p>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="specs-section">
                <h3>Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="detail-add-section">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="qty-input"
              />
              <button className="primary-button" onClick={handleAdd}>
                Add to Cart
              </button>
            </div>
            {message && <div className="info-box">{message}</div>}
          </div>
        </div>

        {recommendations.length > 0 && (
          <section className="products-section">
            <div className="section-header">
              <h2>Related Products</h2>
            </div>
            <div className="products-grid">
              {recommendations.map((rec) => (
                <ProductCard key={rec._id} product={rec} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
