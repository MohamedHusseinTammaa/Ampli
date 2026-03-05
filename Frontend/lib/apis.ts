import axios, { type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    withAuth?: boolean;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.withAuth) {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;