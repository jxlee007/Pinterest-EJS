import axios from 'axios';

const api = axios.create({
  baseURL: '', // Using proxy via next.config.mjs rewrites
  withCredentials: true,
});

export default api;
