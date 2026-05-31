import axios from "axios";

export const API_BASE_URL = "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
