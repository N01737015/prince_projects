import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/api';

const COMPARE_FIELDS = [
  { label: 'Brand', key: 'brand' },
  { label: 'Price', key: 'price', format: (v) => '$' + v },
  { label: 'Stock', key: 'stock', format: (v) => v + ' units' },
  { label: 'Category', key: 'categoryId', format: (v) => (typeof v === 'object' ? v?.name : v) },
  { label: 'Description', key: 'description' },
  { label: 'Status', key: 'status' }
];

const ProductComparisonPage = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const selectedProducts = products.filter((p) => selected.includes(p._id));
  const filteredProducts = products.filter((p) =>
    (p.name + ' ' + p.brand).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderValue = (field, product) => {
    const val = product[field.key];
    if (val === undefined || val === null || val === '') return '-';
    return field.format ? field.format(val) : String(val);
  };

  const colCount = selectedProducts.length + 1;
  const gridCols = '160px ' + selectedProducts.map(() => '1fr').join(' ');

  const allSpecKeys = Array.from(
    new Set(selectedProducts.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <Layout searchTerm="" setSearchTerm={() => {}} onSearch={() => {}} activeCategory="all" onCategoryChange={() => {}} showCategoryNav={false}>
      <div className="container page-section">
        <h2 className="page-title">Product Comparison</h2>
        <p style={{ color: '#6d7583', marginBottom: '28px' }}>
          Select up to 3 products to compare side by side.
        </p>

        {selectedProducts.length >= 2 && (
          <div className="comparison-table-wrap">
            <h3 style={{ marginBottom: '20px' }}>Comparison</h3>
            <div className="comparison-grid" style={{ gridTemplateColumns: gridCols }}>

              <div className="comp-header-cell">Feature</div>
              {selectedProducts.map((p) => (
                <div key={p._id + '-header'} className="comp-header-cell product-col">
                  <div className="comp-product-name">{p.name}</div>
                  <button
                    className="danger-button"
                    style={{ marginTop: '8px', padding: '4px 12px', fontSize: '12px' }}
                    onClick={() => toggleSelect(p._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {COMPARE_FIELDS.map((field) => (
                <Fragment key={field.label}>
                  <div className="comp-label-cell">{field.label}</div>
                  {selectedProducts.map((p) => (
                    <div key={p._id + '-' + field.key} className="comp-value-cell">
                      {renderValue(field, p)}
                    </div>
                  ))}
                </Fragment>
              ))}

              {allSpecKeys.length > 0 && (
                <Fragment key="specs-section">
                  <div
                    className="comp-label-cell comp-section-head"
                    style={{ gridColumn: '1 / ' + (colCount + 1) }}
                  >
                    Technical Specifications
                  </div>
                  {allSpecKeys.map((specKey) => (
                    <Fragment key={'spec-' + specKey}>
                      <div className="comp-label-cell">{specKey}</div>
                      {selectedProducts.map((p) => (
                        <div key={p._id + '-spec-' + specKey} className="comp-value-cell">
                          {p.specs?.[specKey] !== undefined ? String(p.specs[specKey]) : '-'}
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </Fragment>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '16px' }}>
            Select Products {selected.length > 0 && '(' + selected.length + '/3 selected)'}
          </h3>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '12px 18px', border: '1px solid #e6e8ee', borderRadius: '18px', width: '100%', maxWidth: '360px', marginBottom: '20px', outline: 'none' }}
          />

          {loading ? (
            <div className="empty-state">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((p) => {
                const isSelected = selected.includes(p._id);
                const isDisabled = !isSelected && selected.length >= 3;
                const categoryName =
                  typeof p.categoryId === 'object' ? p.categoryId?.name : 'Electronics';

                return (
                  <div
                    key={p._id}
                    className={'product-card' + (isSelected ? ' selected-compare' : '')}
                    onClick={() => !isDisabled && toggleSelect(p._id)}
                    style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 }}
                  >
                    <div className="product-badge">
                      {isSelected ? 'Selected' : isDisabled ? 'Max 3' : 'Click to Select'}
                    </div>
                    <div className="product-image">
                      <div className="product-image-placeholder">
                        {p.brand ? p.brand.charAt(0) : 'P'}
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="product-category">{categoryName}</div>
                      <div className="product-title">{p.name}</div>
                      <div className="product-brand">{p.brand}</div>
                      <div className="product-price-row">
                        <span className="current-price">${p.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductComparisonPage;
