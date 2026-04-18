import api from './api';

export const postApi = {
  getFeed: (page = 1, limit = 10) => api.get(`/api/feed?page=${page}&limit=${limit}`),
  getPost: (id) => api.get(`/api/post/${id}`),
  createPost: (formData) => api.post('/api/createpost', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePost: (id) => api.delete(`/api/delete-post/${id}`),
};
