const API_URL = import.meta.env.VITE_API_URL || 'https://vyaparr-invoice-generator-1.onrender.com/api';

console.log("Resolved API_URL:", API_URL);
/**
 * Helper function to retrieve the token from local storage.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('vyaparflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Universal backend fetch wrapper
 */
export const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('vyaparflow_token');
      localStorage.removeItem('vyaparflow_user');
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    throw new Error(errorData.error || 'API Request failed');
  }

  return response.json();
};

/**
 * Signup Helper
 */
export const signupUser = async (name, email, password) => {
  return fetchApi('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

/**
 * Login Helper
 */
export const loginUser = async (email, password) => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Calls the backend to generate line items using AI logic.
 */
export const generateAiItems = async (prompt) => {
  try {
    const data = await fetchApi('/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    return data;
  } catch (error) {
    console.error('API Error generating items:', error);
    throw error;
  }
};

/**
 * Save Invoice Helper
 */
export const saveInvoice = async (invoiceData) => {
  if (invoiceData._id) {
    return fetchApi(`/invoices/${invoiceData._id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  }
  return fetchApi('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData),
  });
};

/**
 * Fetch past invoices
 */
export const getInvoices = async () => {
  const data = await fetchApi('/invoices');
  return data.invoices;
};

/**
 * Update user onboarding profile
 */
export const updateProfile = async (profileData) => {
  const data = await fetchApi('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return data.user;
};
/**
 * Client API Helpers
 */
export const getClients = async () => {
  const data = await fetchApi('/clients');
  return data.clients;
};

export const createClient = async (clientData) => {
  return fetchApi('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
};

export const updateClient = async (id, clientData) => {
  return fetchApi(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
};

export const deleteClient = async (id) => {
  return fetchApi(`/clients/${id}`, { method: 'DELETE' });
};

/**
 * Product API Helpers
 */
export const getProducts = async () => {
  const data = await fetchApi('/products');
  return data.products;
};

export const createProduct = async (productData) => {
  return fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  return fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return fetchApi(`/products/${id}`, { method: 'DELETE' });
};

export const getAnalytics = async () => {
  const data = await fetchApi('/analytics');
  return data.analytics;
};


export const finalizeInvoice = async (id) => {
  return fetchApi(`/invoices/finalize/${id}`, { method: 'POST' });
};

export const updatePayment = async (id, paymentData) => {
  return fetchApi(`/invoices/payment/${id}`, { 
    method: 'PUT',
    body: JSON.stringify(paymentData)
  });
};

export const logCommunication = async (id, logData) => {
  return fetchApi(`/invoices/communication/${id}`, { 
    method: 'POST',
    body: JSON.stringify(logData)
  });
};

export const deleteInvoice = async (id) => {
  return fetchApi(`/invoices/${id}`, { method: 'DELETE' });
};
