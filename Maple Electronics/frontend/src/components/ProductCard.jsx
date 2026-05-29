import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onCompare, compareList = [] }) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addItem(product._id, 1);
    } catch (error) {
      alert(error.message);
    }
  };

  const categoryName =
    typeof product.categoryId === 'object'
      ? product.categoryId?.name || 'Electronics'
      : 'Electronics';

  const isInCompare = compareList.includes(product._id);

  return (
    <div className="product-card">
      <div className="product-badge">{product.status === 'APPROVED' ? 'IN STOCK' : product.status}</div>
      <div
        className="product-image"
        onClick={() => navigate('/products/' + product._id)}
        style={{ cursor: 'pointer' }}
      >
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="product-img" />
        ) : (
          <div className="product-image-placeholder">{product.brand ? product.brand.charAt(0) : 'P'}</div>
        )}
      </div>
      <div className="product-info">
        <div className="product-category">{categoryName}</div>
        <div
          className="product-title"
          onClick={() => navigate('/products/' + product._id)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </div>
        <div className="product-brand">{product.brand}</div>
        <div className="product-price-row">
          <span className="current-price">${product.price}</span>
        </div>
        <div className="product-card-actions">
          <button className="add-to-cart" onClick={handleAdd}>
            Add to Cart
          </button>
          {onCompare && (
            <button
              className={isInCompare ? 'compare-btn active' : 'compare-btn'}
              onClick={() => onCompare(product._id)}
            >
              {isInCompare ? 'Remove' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
