import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // adjust if different
  withCredentials: true,                // send HTTP-only cookies
});

export default API;
