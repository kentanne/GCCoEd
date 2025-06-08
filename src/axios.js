import axios from "axios";

// const baseURLConst = "https://gccoed.onrender.com";
const baseURLConst = "http://localhost:8000";

const api = axios.create({
  baseURL: baseURLConst,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
  },
});

// Token management functions
const getToken = () => localStorage.getItem("auth_token");
const setToken = (token) => localStorage.setItem("auth_token", token);
const removeToken = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data"); // Also remove user data
};

// User data management functions
const getUserData = () => {
  try {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    // Clear corrupted data
    localStorage.removeItem("user_data");
    return null;
  }
};

const setUserData = (userData) => {
  try {
    localStorage.setItem("user_data", JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

// Request interceptor - automatically adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // This is the key part - adding Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      removeToken(); // This will also clear user data
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { setToken, removeToken, getToken, getUserData, setUserData };
export default api;
