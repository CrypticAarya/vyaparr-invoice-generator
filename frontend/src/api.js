import axios from 'axios';

/**
 * VYAPAARFLOW API CLIENT
 * 
 * We use Axios for our communication layer. This client handles:
 * 1. Dynamic environment detection (Dev vs Production).
 * 2. Automatic JWT injection via interceptors.
 * 3. Silent session refreshing using secure httpOnly cookies.
 */

const API_ENDPOINT = import.meta.env.VITE_API_URL;
const BASE_URL = API_ENDPOINT ? (API_ENDPOINT.endsWith('/') ? API_ENDPOINT : `${API_ENDPOINT}/`) : '/api/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for sending/receiving secure cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * AUTH ATTACHMENT
 * Before every request, we check if we have a short-lived access token.
 */
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('vyaparflow_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * SMART RETRY & ERROR HANDLING
 * If the API returns 401 (Expired), we attempt to refresh the session 
 * once before redirecting the user to login.
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is an expired session and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      
      try {
        // The refresh token is in a secure cookie, so we just hit the endpoint
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // Save the new access token and retry the original call
        localStorage.setItem('vyaparflow_token', data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (cookie expired or revoked), kill the session
        purgeSession();
      }
    }

    // Wrap the error in a predictable structure for the UI
    const errorResponse = error.response?.data || { 
      success: false, 
      message: 'The workstation lost connection to the server.',
      errors: [] 
    };
    
    return Promise.reject(errorResponse);
  }
);

/**
 * SESSION CLEANUP
 * Clears all local evidence of a session and pushes the user to the login screen.
 */
const purgeSession = () => {
  localStorage.removeItem('vyaparflow_token');
  localStorage.removeItem('vyaparflow_user');
  window.location.href = '/login';
};

/**
 * DOMAIN SERVICES
 */

// --- Auth & Identity ---
export const signup = (name, email, password) => apiClient.post('auth/signup', { name, email, password });
export const login = (email, password) => apiClient.post('auth/login', { email, password });
export const logout = () => apiClient.post('auth/logout');
export const updateBusinessProfile = (profile) => apiClient.put('auth/profile', profile).then(res => res.data.user);
export const requestPasswordReset = (email) => apiClient.post('auth/forgot-password', { email });
export const forgotPassword = requestPasswordReset; // Alias
export const submitNewPassword = (token, password) => apiClient.post(`auth/reset-password/${token}`, { password });
export const resetPassword = submitNewPassword; // Alias


// --- Financial Documents (Invoices) ---
export const fetchInvoices = () => apiClient.get('invoices').then(res => res.data.invoices);
export const saveInvoiceRecord = (invoice) => invoice.id ? apiClient.put(`invoices/${invoice.id}`, invoice) : apiClient.post('invoices', invoice);
export const removeInvoiceRecord = (id) => apiClient.delete(`invoices/${id}`);
export const lockInvoice = (id) => apiClient.post(`invoices/finalize/${id}`);
export const recordInvoicePayment = (id, info) => apiClient.put(`invoices/payment/${id}`, info);
export const trackCommunication = (id, log) => apiClient.post(`invoices/communication/${id}`, log);

// --- Relationships (Clients) ---
export const fetchClients = () => apiClient.get('clients').then(res => res.data.clients);
export const onboardClient = (client) => apiClient.post('clients', client);
export const modifyClient = (id, client) => apiClient.put(`clients/${id}`, client);
export const archiveClient = (id) => apiClient.delete(`clients/${id}`);

// --- Logistics (Products) ---
export const fetchProducts = () => apiClient.get('products').then(res => res.data.products);
export const onboardProduct = (product) => apiClient.post('products', product);
export const modifyProduct = (id, product) => apiClient.put(`products/${id}`, product);
export const archiveProduct = (id) => apiClient.delete(`products/${id}`);

// --- Intelligence ---
export const fetchBusinessAnalytics = (range) => apiClient.get(`analytics?range=${range || '1Y'}`).then(res => res.data.analytics);
export const aiParseLineItems = (prompt) => apiClient.post('generate', { prompt });
export const fetchAiCfoInsights = () => apiClient.get('generate/insights').then(res => res.data.insights);

// --- Advanced / Legacy ---
export const fetchProductLedger = (productId) => apiClient.get(`products/${productId}/ledger`).then(res => res.data.transactions);
export const fetchApi = (endpoint, options = {}) => {
  const method = options.method?.toLowerCase() || 'get';
  return apiClient[method](endpoint, options.body ? JSON.parse(options.body) : undefined);
};

export default apiClient;
