import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gccoed.onrender.com',
    // baseURL: 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // Add other default headers if needed
  }
});

export default api;
