import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('b2b_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      // (avoid redirect loop if already on login/register)
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        localStorage.removeItem('b2b_token');
        localStorage.removeItem('b2b_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

// RFQ Services
export const rfqService = {
  getAll: async (params = {}) => {
    const res = await api.get('/rfqs', { params });
    return res.data;
  },
  getMyRFQs: async () => {
    const res = await api.get('/rfqs/my');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/rfqs/${id}`);
    return res.data;
  },
  create: async (rfqData) => {
    const res = await api.post('/rfqs', rfqData);
    return res.data;
  },
  update: async (id, rfqData) => {
    const res = await api.put(`/rfqs/${id}`, rfqData);
    return res.data;
  }
};

// Quotation Services
export const quotationService = {
  submit: async (quoteData) => {
    const res = await api.post('/quotations', quoteData);
    return res.data;
  },
  getMyQuotations: async () => {
    const res = await api.get('/quotations/my');
    return res.data;
  },
  getByRFQ: async (rfqId) => {
    const res = await api.get(`/quotations/rfq/${rfqId}`);
    return res.data;
  }
};

export default api;
