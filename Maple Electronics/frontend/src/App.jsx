import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutTeamPage from './pages/AboutTeamPage';
import ProductComparisonPage from './pages/ProductComparisonPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutTeamPage />} />
      <Route path="/compare" element={<ProductComparisonPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor"
        element={
          <ProtectedRoute requiredRole="VENDOR">
            <VendorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
