import axios from 'axios';

const TOKEN_KEY = 'swabi_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setToken(null);
    }
    return Promise.reject(err);
  }
);

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const fetchProduct = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/products/categories');
  return data;
};

export const apiRegister = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const apiLogin = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const apiMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const apiCreateOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const apiMyOrders = async () => {
  const { data } = await api.get('/orders/me');
  return data;
};

export const apiGetOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

// ---------- Admin ----------

export const apiAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const apiAdminListProducts = async (params = {}) => {
  const { data } = await api.get('/admin/products', { params });
  return data;
};

export const apiAdminGetProduct = async (id) => {
  const { data } = await api.get(`/admin/products/${id}`);
  return data;
};

export const apiAdminCreateProduct = async (payload) => {
  const { data } = await api.post('/admin/products', payload);
  return data;
};

export const apiAdminUpdateProduct = async (id, payload) => {
  const { data } = await api.put(`/admin/products/${id}`, payload);
  return data;
};

export const apiAdminDeleteProduct = async (id) => {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
};

export const apiAdminListOrders = async (params = {}) => {
  const { data } = await api.get('/admin/orders', { params });
  return data;
};

export const apiAdminGetOrder = async (id) => {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data;
};

export const apiAdminUpdateOrderStatus = async (id, payload) => {
  const { data } = await api.patch(`/admin/orders/${id}/status`, payload);
  return data;
};

export default api;
