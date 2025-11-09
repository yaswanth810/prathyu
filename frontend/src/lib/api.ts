import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
};

// Users
export const usersAPI = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
  getUser: (id: string) => api.get(`/users/${id}`),
  searchUsers: (params: any) => api.get('/users', { params }),
};

// Skills
export const skillsAPI = {
  create: (data: any) => api.post('/skills', data),
  getMySkills: () => api.get('/skills/my-skills'),
  search: (params: any) => api.get('/skills/search', { params }),
  getCategories: () => api.get('/skills/categories'),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

// Sessions
export const sessionsAPI = {
  create: (data: any) => api.post('/sessions', data),
  getMySessions: (params?: any) => api.get('/sessions/my-sessions', { params }),
  getSession: (id: string) => api.get(`/sessions/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/sessions/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};

// Messages
export const messagesAPI = {
  send: (data: { content: string; receiverId: string }) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId: string) => api.get(`/messages/${userId}`),
  markAsRead: (userId: string) => api.patch(`/messages/${userId}/read`),
};

// Reviews
export const reviewsAPI = {
  create: (data: any) => api.post('/reviews', data),
  getUserReviews: (userId: string) => api.get(`/reviews/user/${userId}`),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params: any) => api.get('/admin/users', { params }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id: string, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
};

export { api };
export default api;
