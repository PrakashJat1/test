import axios from "@/utils/axios";

const getAll = () => axios.get("/api/book/getAllBooks");
const addBook = (data) => axios.post("/api/book/addBook", data);
const editBook = (data) =>
  axios.put(`/api/book/updateBookById/${data.id}`, data);
const issueRequestByStudent = (studentId, bookId) =>
  axios.post(`/api/book/issueRequestByStudent/${studentId}/${bookId}`);

const deleteAll = (data) =>
  axios.delete("/api/book/deleteAllById", { data: data });

export default {
  getAll,
  addBook,
  editBook,
  issueRequestByStudent,
  deleteAll,
};
