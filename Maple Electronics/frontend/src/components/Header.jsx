import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ searchTerm, setSearchTerm, onSearch }) => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div>
            <i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i>
            +1 (800) 555-0123
            <span className="top-sep"> | </span>
            <i className="fas fa-envelope" style={{ marginRight: '6px' }}></i>
            support@mapleelectronics.com
          </div>
          <div className="top-links">
            <span>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>
              Canada
            </span>
            {isAuthenticated ? (
              <>
                <span className="top-sep">|</span>
                <span>{user?.name || user?.email}</span>
                <span className="top-sep">|</span>
                <span className="role-badge">{role}</span>
                <button className="link-button" onClick={logout}>
                  <i className="fas fa-sign-out-alt" style={{ marginRight: '4px' }}></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="top-sep">|</span>
                <Link to="/login">
                  <i className="fas fa-user" style={{ marginRight: '4px' }}></i>
                  My Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="main-nav">
        <div className="container nav-wrapper">
          <Link to="/" className="logo">
            <div className="maple-logo">
              <i className="fas fa-leaf"></i>
            </div>
            <div className="logo-text">
              <span className="brand">Maple</span>
              <span className="sub">Electronics</span>
            </div>
          </Link>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            <button onClick={onSearch}>
              <i className="fas fa-search" style={{ marginRight: '6px' }}></i>
              Search
            </button>
          </div>

          <div className="nav-icons">
            {role === 'VENDOR' && (
              <button className="nav-icon-button" onClick={() => navigate('/vendor')}>
                <i className="fas fa-store"></i>
                Vendor
              </button>
            )}
            {role === 'ADMIN' && (
              <button className="nav-icon-button" onClick={() => navigate('/admin')}>
                <i className="fas fa-shield-alt"></i>
                Admin
              </button>
            )}
            <button className="nav-icon-button" onClick={() => navigate('/compare')}>
              <i className="fas fa-balance-scale"></i>
              Compare
            </button>
            <button className="nav-icon-button" onClick={() => navigate('/about')}>
              <i className="fas fa-info-circle"></i>
              About
            </button>
            {isAuthenticated && (
              <button className="nav-icon-button" onClick={() => navigate('/orders')}>
                <i className="fas fa-box"></i>
                Orders
              </button>
            )}
            <button className="nav-icon-button cart-button" onClick={() => navigate('/cart')}>
              <i className="fas fa-shopping-cart"></i>
              Cart
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
