import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout
      searchTerm=""
      setSearchTerm={() => {}}
      onSearch={() => {}}
      activeCategory="all"
      onCategoryChange={() => {}}
      showCategoryNav={false}
    >
      <div className="container auth-page">
        <div className="auth-card">
          <h2>Login to Maple Electronics</h2>
          <p className="auth-subtitle">Use your Keycloak account credentials.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error && <div className="error-box">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo Accounts</strong>
            <p>Admin: admin1@example.com / Admin@123</p>
            <p>Vendor: vendor1@example.com / Vendor@123</p>
            <p>Customer: customer1@example.com / password123</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;