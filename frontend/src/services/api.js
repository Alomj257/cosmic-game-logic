import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ User API
export const registerUser = (userData) => API.post("/user/register", userData);

// ✅ Tag APIs
export const createTag = (tagData) => API.post("/tags/create", tagData);
export const getAllTags = () => API.get("/tags/list");
export const getTagsByDataType = (dataTypeCode) =>
  API.get(`/tags/list/${dataTypeCode}`);
export const getTagById = (id) => API.get(`/tags/${id}`);
export const getTagMainIdsByDataType = (dataTypeCode) =>
  API.get(`/tags/tagMainIds/${dataTypeCode}`);
export const getTagDetailsByTagMainId = (tagMainId) =>
  API.get(`/tags/tagDetails/${tagMainId}`);
export const updateTag = (id, updatedData) =>
  API.put(`/tags/update/${id}`, updatedData);
export const deleteTag = (id) => API.delete(`/tags/delete/${id}`);

// ✅ Book APIs
export const createBook = (bookData) => API.post("/book/create", bookData);
export const getAllBooks = () => API.get("/book/list");
export const getBookNamesOnly = () => API.get("/book/names");
export const getBookById = (id) => API.get(`/book/${id}`);
export const updateBook = (id, updatedData) =>
  API.put(`/book/update/${id}`, updatedData);
export const deleteBook = (id) => API.delete(`/book/delete/${id}`);

export default API;
