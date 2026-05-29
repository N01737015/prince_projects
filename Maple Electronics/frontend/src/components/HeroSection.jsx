const HeroSection = ({ onCategoryChange }) => {
  return (
    <section className="hero">
      <div className="collection-grid">
        <div
          className="collection-card navy-card"
          onClick={() => onCategoryChange('laptops')}
        >
          <div className="collection-bg">
            <i className="fas fa-laptop"></i>
          </div>
          <div className="collection-overlay">
            <h3>Laptop<br />Collection</h3>
            <span className="shop-now">SHOP NOW →</span>
          </div>
        </div>

        <div
          className="collection-card red-card"
          onClick={() => onCategoryChange('smartphones')}
        >
          <div className="collection-bg">
            <i className="fas fa-mobile-alt"></i>
          </div>
          <div className="collection-overlay">
            <h3>Smartphone<br />Collection</h3>
            <span className="shop-now">SHOP NOW →</span>
          </div>
        </div>

        <div
          className="collection-card orange-card"
          onClick={() => onCategoryChange('audio')}
        >
          <div className="collection-bg">
            <i className="fas fa-headphones"></i>
          </div>
          <div className="collection-overlay">
            <h3>Audio<br />Collection</h3>
            <span className="shop-now">SHOP NOW →</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
