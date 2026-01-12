// frontend/src/services/apiService.js

import axios from "axios";
import { toast } from "react-toastify";

const DATA_API_URL =
  process.env.REACT_APP_DATA_API_URL || "http://localhost:5002/api";

const apiClient = axios.create({
  baseURL: DATA_API_URL,
  timeout: 10000,
});

// Attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const api = {
  // PRODUCTS
  getProducts: (params) =>
    apiClient.get("/products", { params }).then((res) => res.data),

  getProduct: (id) =>
    apiClient.get(`/products/${id}`).then((res) => res.data.product),

  createProduct: (data) =>
    apiClient.post("/products", data).then((res) => res.data),

  updateProduct: (id, data) =>
    apiClient.put(`/products/${id}`, data).then((res) => res.data),

  deleteProduct: (id) =>
    apiClient.delete(`/products/${id}`).then((res) => res.data),

  getStats: () =>
    apiClient.get("/products").then((res) => ({
      totalProducts: res.data.totalProducts,
      electronics:
        res.data.products?.filter((p) => p.category === "Electronics").length ||
        0,
      clothing:
        res.data.products?.filter((p) => p.category === "Clothing").length ||
        0,
    })),
};

export default api;
