import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h4>
            <i className="fas fa-leaf" style={{ color: '#f4a261', marginRight: '8px' }}></i>
            Maple Electronics
          </h4>
          <p>Premium multi-vendor electronics marketplace built with Node.js, React, MongoDB, and Keycloak.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/"><i className="fas fa-home" style={{ marginRight: '6px' }}></i>Home</Link>
          <Link to="/about"><i className="fas fa-users" style={{ marginRight: '6px' }}></i>About Team</Link>
          <Link to="/compare"><i className="fas fa-balance-scale" style={{ marginRight: '6px' }}></i>Compare Products</Link>
          <Link to="/cart"><i className="fas fa-shopping-cart" style={{ marginRight: '6px' }}></i>Cart</Link>
        </div>
        <div>
          <h4>Categories</h4>
          <span><i className="fas fa-laptop" style={{ marginRight: '6px' }}></i>Laptops</span>
          <span><i className="fas fa-mobile-alt" style={{ marginRight: '6px' }}></i>Smartphones</span>
          <span><i className="fas fa-camera" style={{ marginRight: '6px' }}></i>Cameras</span>
          <span><i className="fas fa-headphones" style={{ marginRight: '6px' }}></i>Audio</span>
        </div>
        <div>
          <h4>Follow Us</h4>
          <a href="#"><i className="fab fa-facebook" style={{ marginRight: '6px' }}></i>Facebook</a>
          <a href="#"><i className="fab fa-twitter" style={{ marginRight: '6px' }}></i>Twitter</a>
          <a href="#"><i className="fab fa-instagram" style={{ marginRight: '6px' }}></i>Instagram</a>
          <a href="#"><i className="fab fa-linkedin" style={{ marginRight: '6px' }}></i>LinkedIn</a>
        </div>
      </div>
      <div className="container copyright">
        2026 Maple Electronics. All rights reserved. | Docker | MongoDB | Keycloak | React
      </div>
    </footer>
  );
};

export default Footer;
