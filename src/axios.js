import axios from "axios";

const baseURLConst = "https://gccoed.onrender.com";
// const baseURLConst = "http://localhost:8000";

console.log("🔧 Axios Configuration:");
console.log("Base URL:", baseURLConst);
console.log("Environment:", import.meta.env.MODE);

const api = axios.create({
  baseURL: baseURLConst,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
  },
  timeout: 30000, // 30 second timeout
});

// Token management functions
const getToken = () => localStorage.getItem("auth_token");
const setToken = (token) => localStorage.setItem("auth_token", token);
const removeToken = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
};

// User data management functions
const getUserData = () => {
  try {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
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

// Request interceptor with detailed logging
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    console.log(
      `🚀 Making ${config.method.toUpperCase()} request to:`,
      config.url
    );
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Token present:", token ? "✅ Yes" : "❌ No");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set");
    } else {
      console.warn("⚠️ No token found - request will be unauthenticated");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method.toUpperCase()} ${
        response.config.url
      } - Status: ${response.status}`
    );
    return response;
  },
  (error) => {
    const config = error.config;
    const response = error.response;

    console.error("❌ API Error Details:");
    console.error("Request:", {
      method: config?.method?.toUpperCase(),
      url: config?.url,
      fullURL: `${config?.baseURL}${config?.url}`,
      headers: config?.headers,
    });

    if (response) {
      console.error("Response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });

      // Specific handling for different error types
      if (response.status === 500) {
        console.error("🔥 500 Internal Server Error - Backend issue detected");
        console.error("This usually indicates a server-side problem:");
        console.error("- Database connection issues");
        console.error("- PHP/Laravel errors");
        console.error("- Missing environment variables");
        console.error("- Server configuration problems");
      } else if (response.status === 401) {
        console.error("🔐 401 Unauthorized - Token issue");
        removeToken();
        window.location.href = "/login";
      } else if (response.status === 404) {
        console.error("🔍 404 Not Found - Endpoint doesn't exist");
      } else if (response.status === 403) {
        console.error("🚫 403 Forbidden - Access denied");
      }
    } else if (error.request) {
      console.error("📡 Network Error:", {
        message: "No response received from server",
        timeout: error.code === "ECONNABORTED",
        networkError: true,
      });
    } else {
      console.error("⚙️ Request Setup Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export { setToken, removeToken, getToken, getUserData, setUserData };
export default api;
