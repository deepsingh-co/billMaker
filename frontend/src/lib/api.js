import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

const unwrap = (request) => request.then((response) => response.data);

export const getProductByBarcode = (barcode) =>
  unwrap(client.get(`/products/${encodeURIComponent(barcode)}`));

export const getBills = () => unwrap(client.get("/bills"));

export const getAnalytics = (days = 7) =>
  unwrap(client.get("/bills/analytics", { params: { days } }));

export const createBill = (payload) => unwrap(client.post("/bills/add", payload));
