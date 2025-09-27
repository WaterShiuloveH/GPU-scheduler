import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000", // backend server
  timeout: 5000,
});
