import axios from "axios";

// IMPORTANT: Frontend reads the backend URL from the .env file.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Every request automatically carries the JWT token (if the user is logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bizsphere_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
