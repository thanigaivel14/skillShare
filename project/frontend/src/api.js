import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  // baseURL:"http://localhost:8000/api",
  withCredentials: true,
});

export default API;
