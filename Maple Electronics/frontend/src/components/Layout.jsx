import Header from './Header';
import CategoryNav from './CategoryNav';
import Footer from './Footer';

const Layout = ({
  children,
  searchTerm,
  setSearchTerm,
  onSearch,
  activeCategory,
  onCategoryChange,
  showCategoryNav = true
}) => {
  return (
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
      />
      {showCategoryNav && (
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      )}
      <main className="page-main">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;