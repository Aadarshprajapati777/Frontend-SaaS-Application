import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      console.log('Unauthorized, logging out...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/me'),
  generateApiKey: () => api.post('/api/auth/apikey'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData) => api.put('/api/users/profile', userData),
  changePassword: (passwordData) => api.put('/api/users/change-password', passwordData),
  getUsage: () => api.get('/api/users/usage'),
  deleteAccount: () => api.delete('/api/users'),
};

// Document API
export const documentAPI = {
  getDocuments: () => api.get('/api/documents'),
  getDocument: (id) => api.get(`/api/documents/${id}`),
  uploadDocument: (formData) => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    return api.post('/api/documents', formData, { headers });
  },
  updateDocument: (id, data) => api.put(`/api/documents/${id}`, data),
  deleteDocument: (id) => api.delete(`/api/documents/${id}`),
};

// Model API
export const modelAPI = {
  getModels: () => api.get('/api/models'),
  getModel: (id) => api.get(`/api/models/${id}`),
  createModel: (data) => api.post('/api/models', data),
  trainModel: (id) => api.post(`/api/models/${id}/train`),
  deleteModel: (id) => api.delete(`/api/models/${id}`),
};

// Chat API
export const chatAPI = {
  getChats: () => api.get('/api/chat'),
  getChat: (id) => api.get(`/api/chat/${id}`),
  createChat: (data) => api.post('/api/chat', data),
  updateChat: (id, data) => api.put(`/api/chat/${id}`, data),
  deleteChat: (id) => api.delete(`/api/chat/${id}`),
  sendMessage: (chatId, message) => api.post(`/api/chat/${chatId}/messages`, message),
};

// Team API
export const teamAPI = {
  getTeams: () => api.get('/api/teams'),
  getTeam: (id) => api.get(`/api/teams/${id}`),
  createTeam: (data) => api.post('/api/teams', data),
  updateTeam: (id, data) => api.put(`/api/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/api/teams/${id}`),
  addTeamMember: (teamId, data) => api.post(`/api/teams/${teamId}/members`, data),
  updateMemberRole: (teamId, userId, data) => api.put(`/api/teams/${teamId}/members/${userId}`, data),
  removeTeamMember: (teamId, userId) => api.delete(`/api/teams/${teamId}/members/${userId}`),
};

// Payment API
export const paymentAPI = {
  getPlans: () => api.get('/api/payments/plans'),
  getCurrentSubscription: () => api.get('/api/payments/subscription'),
  subscribe: (data) => api.post('/api/payments/subscribe', data),
  cancelSubscription: (data) => api.post('/api/payments/cancel', data),
  getPaymentHistory: () => api.get('/api/payments/history'),
  updatePaymentMethod: (data) => api.put('/api/payments/method', data),
};

export default api; 