import api from './api';

export const userApi = {
  getProfile: () => api.get('/api/profile'),
  editProfile: (data) => api.post('/api/edit', data),
  uploadProfileImage: (formData) => api.post('/api/fileupload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createBoard: (data) => api.post('/api/board', data),
  getBoard: (id) => api.get(`/api/board/${id}`),
  deleteBoard: (id) => api.delete(`/api/delete-board/${id}`),
  addPostToBoard: (data) => api.post('/api/addposttoboard', data),
};
