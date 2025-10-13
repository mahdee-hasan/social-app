import axios from "axios";
import { useUserStore } from "./app/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// ✅ Request interceptor: attach token dynamically
api.interceptors.request.use((config) => {
  const idToken = useUserStore.getState().idToken;

  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  // only set default JSON if body is a plain object
  if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// ✅ Response interceptor: handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized, redirecting to login...");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
