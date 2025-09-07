// src/services/api.js
import axios from "axios";

// Vite uses import.meta.env for environment variables
const API_BASE = import.meta.env.VITE_API || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = "Bearer " + token;
  return cfg;
});

export default api;
