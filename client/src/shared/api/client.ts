import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not configured");
}

export { API_BASE_URL };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
