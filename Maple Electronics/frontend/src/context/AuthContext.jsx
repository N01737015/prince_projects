import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.access_token);
      setUser(data.user);

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const me = await api.getMe(token);
      setUser(me);
      localStorage.setItem('user', JSON.stringify(me));
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (token && !user) {
      refreshMe();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, refreshMe, loading, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);