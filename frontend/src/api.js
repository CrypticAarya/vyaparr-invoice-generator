import axios from 'axios';

const VITE_API = import.meta.env.VITE_API_URL;
let API_URL = (VITE_API && VITE_API !== '') 
  ? VITE_API 
  : 'http://localhost:5001/api';

// Standardize: Ensure the API URL always includes the /api prefix
if (API_URL && !API_URL.includes('/api')) {
  API_URL = `${API_URL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vyaparflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle token refresh on 401
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('vyaparflow_refresh_token');

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          
          localStorage.setItem('vyaparflow_token', data.token);
          localStorage.setItem('vyaparflow_refresh_token', data.refreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          localStorage.removeItem('vyaparflow_token');
          localStorage.removeItem('vyaparflow_refresh_token');
          localStorage.removeItem('vyaparflow_user');
          window.location.href = '/login';
        }
      } else {
        // No refresh token - logout
        localStorage.removeItem('vyaparflow_token');
        localStorage.removeItem('vyaparflow_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

export const fetchApi = (endpoint, options = {}) => {
  const method = options.method?.toLowerCase() || 'get';
  return api[method](endpoint, options.body ? JSON.parse(options.body) : undefined);
};

// Auth Helpers
export const signupUser = (name, email, password) => api.post('/auth/signup', { name, email, password });
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const logoutUser = () => api.post('/auth/logout');
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, { password });
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);

// Domain Helpers
export const getInvoices = () => api.get('/invoices').then(res => res.data.invoices);
export const saveInvoice = (data) => data._id ? api.put(`/invoices/${data._id}`, data) : api.post('/invoices', data);
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`);
export const finalizeInvoice = (id) => api.post(`/invoices/finalize/${id}`);
export const updatePayment = (id, data) => api.put(`/invoices/payment/${id}`, data);

export const getClients = () => api.get('/clients').then(res => res.data.clients);
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

export const getProducts = () => api.get('/products').then(res => res.data.products);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getAnalytics = (range) => api.get(`/analytics?range=${range || '1Y'}`).then(res => res.data.analytics);
export const generateAiItems = (prompt) => api.post('/generate', { prompt });
export const getAiInsights = () => api.get('/generate/insights').then(res => res.data.insights);
export const updateProfile = (data) => api.put('/auth/profile', data).then(res => res.data.user);
export const logCommunication = (id, data) => api.post(`/invoices/communication/${id}`, data);

export default api;
