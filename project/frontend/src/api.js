import axios from "axios";

const API = axios.create({
  baseURL: "https://skillshare-1j86.onrender.com/api", // adjust if different
  
  withCredentials: true,                // send HTTP-only cookies
});

export default API;
