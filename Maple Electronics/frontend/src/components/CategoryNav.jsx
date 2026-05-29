const categories = [
  { label: 'All Products', value: 'all' },
  { label: 'Hot Deals', value: 'hot' },
  { label: 'Laptops', value: 'laptops' },
  { label: 'Smartphones', value: 'smartphones' },
  { label: 'Cameras', value: 'cameras' },
  { label: 'Audio', value: 'audio' },
  { label: 'Tablets', value: 'tablets' },
  { label: 'Gaming', value: 'gaming' }
];

const CategoryNav = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-nav">
      <div className="container">
        <div className="category-links">
          {categories.map((category) => (
            <button
              key={category.value}
              className={activeCategory === category.value ? 'active' : ''}
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
