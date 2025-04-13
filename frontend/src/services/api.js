import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

export const registerUser = (userData) => API.post("/user/register", userData);

export default API;
