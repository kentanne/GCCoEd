import axios from "axios";

// const baseURLConst = "https://gccoed.onrender.com";
const baseURLConst = "http://localhost:8000";

const api = axios.create({
  // baseURL: baseURLConst,
  baseURL: baseURLConst,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.interceptors.request.use(
  async (config) => {
    // Only fetch CSRF token if it doesn't exist
    if (!document.cookie.includes("XSRF-TOKEN")) {
      await axios.get(`${baseURLConst}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 419) {
      // CSRF token mismatch - retry the request once
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        await axios.get(`${baseURLConst}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
