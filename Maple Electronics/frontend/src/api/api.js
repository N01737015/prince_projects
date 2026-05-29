const API_BASE = 'http://localhost:8080/api';

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const api = {
  login: (email, password) =>
    request(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),

  getMe: (token) =>
    request(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${API_BASE}/products${query ? '?' + query : ''}`);
  },

  getProductById: (id) =>
    request(`${API_BASE}/products/${id}`),

  getRecommendations: (id) =>
    request(`${API_BASE}/products/${id}/recommendations`),

  getAdminProducts: (token) =>
    request(`${API_BASE}/products/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  createProduct: (token, data) =>
    request(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  updateProduct: (token, id, data) =>
    request(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  updateProductStatus: (token, id, status) =>
    request(`${API_BASE}/products/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }),

  deleteProduct: (token, id) =>
    request(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  getMyProducts: (token) =>
    request(`${API_BASE}/products/vendor/myproducts`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getCategories: () =>
    request(`${API_BASE}/categories`),

  createCategory: (token, data) =>
    request(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  getVendors: (token) =>
    request(`${API_BASE}/vendors`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateVendorStatus: (token, id, vendorStatus) =>
    request(`${API_BASE}/vendors/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ vendorStatus })
    }),

  getCart: (token) =>
    request(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  addToCart: (token, productId, quantity = 1) =>
    request(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    }),

  updateCartItem: (token, productId, quantity) =>
    request(`${API_BASE}/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    }),

  removeCartItem: (token, productId) =>
    request(`${API_BASE}/cart/items/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  clearCart: (token) =>
    request(`${API_BASE}/cart`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  createOrder: (token, shippingAddress) =>
    request(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ shippingAddress })
    }),

  getMyOrders: (token) =>
    request(`${API_BASE}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getAllOrders: (token) =>
    request(`${API_BASE}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getOrderById: (token, id) =>
    request(`${API_BASE}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateOrderStatus: (token, id, status) =>
    request(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })
};
