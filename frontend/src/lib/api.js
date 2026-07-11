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
  try {
    const m = method.toLowerCase();
    const res = await http.request({
      method: m,
      url,
      ...(m === "get" ? { params: payload } : { data: payload }),
      ...config,
    });
    return res.data;
  } catch (e) {
    return (
      e.response?.data || {
        data: null,
        message: e.message || "Network error",
        status: e.response?.status || 500,
        type: "error",
      }
    );
  }
}

export const isOk = (res) =>
  res && (res.type === "success" || res.status === 200 || res.status === 201);
