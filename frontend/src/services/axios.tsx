// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-gemstone-p4ul4fs-projects.vercel.app/api", 
});

export default api;
