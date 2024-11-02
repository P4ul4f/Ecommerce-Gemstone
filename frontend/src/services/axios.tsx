// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Cambia según tu URL de backend
});

export default api;
