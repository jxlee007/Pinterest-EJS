import api from './api';

export const authApi = {
  getMe: () => api.get('/auth/me'),
  login: (credentials) => api.post('/api/login', credentials),
  register: (data) => api.post('/api/register', data),
  logout: () => api.post('/api/logout'),
};
