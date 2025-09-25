import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Extend InternalAxiosRequestConfig to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Extend error response type
interface ErrorResponse {
  detail?: string;
}

const api = axios.create({
  baseURL: "http://localhost:8000", // your backend URL
  headers: { "Content-Type": "application/json" },
});

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// Request interceptor
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse, any> & { config?: CustomAxiosRequestConfig }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response.data?.detail?.includes("not valid for any token type") &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        const { data } = await api.post("/api/auth/refresh/", { refresh: refreshToken });

        localStorage.setItem("access_token", data.access);
        if (data.refresh) localStorage.setItem("refresh_token", data.refresh);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Optional: redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;