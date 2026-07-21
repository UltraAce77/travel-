import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8081";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Thin wrapper returning the backend's { data, message, status, type } envelope.
 * Never throws — network/HTTP errors are normalized into the same shape.
 */
export async function api(method, url, payload, config = {}) {
  const { retries = 0, retryDelay = 1200, ...requestConfig } = config;
  const m = method.toLowerCase();

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await http.request({
        method: m,
        url,
        ...(m === "get" ? { params: payload } : { data: payload }),
        ...requestConfig,
      });
      return res.data;
    } catch (e) {
      const status = e.response?.status;
      const retryable = !status || [408, 429, 500, 502, 503, 504].includes(status);
      if (attempt < retries && retryable) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }
      return e.response?.data || {
        data: null,
        message: e.code === "ECONNABORTED" ? "The server took too long to respond. Please try again." : e.message || "Network error",
        status: status || 500,
        type: "error",
      };
    }
  }
}

export const isOk = (res) =>
  res && (res.type === "success" || res.status === 200 || res.status === 201);
