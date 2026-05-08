import axios from 'axios';

/**
 * API CONFIGURATION
 * We dynamically detect the environment and point to the correct backend.
 * Local development defaults to 5001 to avoid macOS system port conflicts.
 */
const VITE_API = import.meta.env.VITE_API_URL;
let BASE_URL = (VITE_API && VITE_API !== '') 
  ? VITE_API 
  : 'http://localhost:5001/api';

// Standardization: Always ensure the /api suffix exists for consistent routing.
if (BASE_URL && !BASE_URL.includes('/api')) {
  BASE_URL = `${BASE_URL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the Bearer token to every outgoing request 
 * if a valid session exists in localStorage.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vyaparflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * RESPONSE INTERCEPTOR
 * Handles silent token refreshing for expired sessions.
 * If a 401 error occurs, it attempts to use the refresh token before forcing a logout.
 */
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Trigger refresh only if the status is 401 and we haven't already retried.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('vyaparflow_refresh_token');

      if (refreshToken) {
        try {
          // Exchange the refresh token for a new pair of tokens.
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          
          localStorage.setItem('vyaparflow_token', data.token);
          localStorage.setItem('vyaparflow_refresh_token', data.refreshToken);

          // Re-attempt the original request with the new identity.
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails (e.g., token expired/revoked), we purge the session.
          clearSession();
        }
      } else {
        clearSession();
      }
    }

    // Pass through structured error messages from the backend or a sanitized fallback.
    const errorData = error.response?.data || { 
      success: false, 
      message: error.message || 'The workstation could not complete this request.',
      errors: [] 
    };
    return Promise.reject(errorData);
  }
);

// Helper to sanitize the client state on session failure.
const clearSession = () => {
  localStorage.removeItem('vyaparflow_token');
  localStorage.removeItem('vyaparflow_refresh_token');
  localStorage.removeItem('vyaparflow_user');
  window.location.href = '/login';
};

/**
 * EXPORTED API SERVICES
 * Organized by domain to reflect the business structure.
 */

// --- Authentication ---
export const signupUser = (name, email, password) => api.post('/auth/signup', { name, email, password });
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const logoutUser = () => api.post('/auth/logout');
export const updateProfile = (data) => api.put('/auth/profile', data).then(res => res.data.user);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, { password });

// --- Utilities ---
export const fetchApi = (endpoint, options = {}) => {
  const method = options.method?.toLowerCase() || 'get';
  return api[method](endpoint, options.body ? JSON.parse(options.body) : undefined);
};

// --- Invoices ---
export const getInvoices = () => api.get('/invoices').then(res => res.data.invoices);
export const saveInvoice = (data) => data._id ? api.put(`/invoices/${data._id}`, data) : api.post('/invoices', data);
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`);
export const finalizeInvoice = (id) => api.post(`/invoices/finalize/${id}`);
export const updatePayment = (id, data) => api.put(`/invoices/payment/${id}`, data);
export const logCommunication = (id, data) => api.post(`/invoices/communication/${id}`, data);

// --- Clients & Relationships ---
export const getClients = () => api.get('/clients').then(res => res.data.clients);
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// --- Products & Inventory ---
export const getProducts = () => api.get('/products').then(res => res.data.products);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// --- Business Intelligence (AI) ---
export const getAnalytics = (range) => api.get(`/analytics?range=${range || '1Y'}`).then(res => res.data.analytics);
export const generateAiItems = (prompt) => api.post('/generate', { prompt });
export const getAiInsights = () => api.get('/generate/insights').then(res => res.data.insights);

export default api;
