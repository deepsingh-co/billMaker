import axios from "axios";
import { getStoredToken } from "./tokenStore";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const UNAUTHORIZED_EVENT = "barcode-suite:unauthorized";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

client.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthRequest = url.startsWith("/auth/");

    // A protected request failed mid-session: let the app return to sign-in.
    if (status === 401 && !isAuthRequest) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  }
);

const unwrap = (request) => request.then((response) => response.data);

export const loginUser = (payload) => unwrap(client.post("/auth/login", payload));

export const registerUser = (payload) =>
  unwrap(client.post("/auth/register", payload));

export const getCurrentUser = () => unwrap(client.get("/auth/me"));

export const getProductByBarcode = (barcode) =>
  unwrap(client.get(`/products/${encodeURIComponent(barcode)}`));

export const getBills = () => unwrap(client.get("/bills"));

export const getAnalytics = (days = 7) =>
  unwrap(client.get("/bills/analytics", { params: { days } }));

export const createBill = (payload) => unwrap(client.post("/bills/add", payload));
