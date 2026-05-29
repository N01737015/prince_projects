import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
        setDisplayedProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const applyFilters = (category, term) => {
    let filtered = [...products];

    if (category !== 'all' && category !== 'hot') {
      filtered = filtered.filter((product) => {
        const categoryName =
          typeof product.categoryId === 'object'
            ? product.categoryId?.name?.toLowerCase()
            : '';
        return categoryName?.includes(category);
      });
    }

    if (category === 'hot') {
      filtered = filtered.slice(0, 4);
    }

    if (term.trim()) {
      filtered = filtered.filter((product) =>
        `${product.name} ${product.brand}`.toLowerCase().includes(term.toLowerCase())
      );
    }

    setDisplayedProducts(filtered);
  };

  const handleSearch = () => {
    applyFilters(activeCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    applyFilters(category, searchTerm);
  };

  const productCountText = useMemo(() => {
    if (loading) return 'Loading products...';
    return `${displayedProducts.length} product(s) available`;
  }, [loading, displayedProducts]);

  return (
    <Layout
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onSearch={handleSearch}
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
    >
      <div className="container">
        <HeroSection onCategoryChange={handleCategoryChange} />

        <section className="products-section">
          <div className="section-header">
            <h2>NEW PRODUCTS</h2>
            <p>{productCountText}</p>
          </div>

          {loading ? (
            <div className="empty-state">Loading products...</div>
          ) : displayedProducts.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            <div className="products-grid">
              {displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;