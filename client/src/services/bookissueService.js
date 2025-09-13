import axios from "@/utils/axios";

const getAll = () => axios.get("/api/book-issue/getAllIssuesBooks");

const getIssueRequestByStudentId = (id) =>
  axios.get(`/api/book-issue/getIssueRequestByStudentId/${id}`);

const updateIssueRequest = (data) =>
  axios.put(`/api/book-issue/updateIssueRequest/${data.id}`, data);

const approveBooksIssueRequest = (data) =>
  axios.put("/api/book-issue/approveBooksIssueRequest", data);

const rejectBooksIssueRequest = (data) =>
  axios.put("/api/book-issue/rejectBooksIssueRequest", data);

const deleteAll = (data) =>
  axios.delete("/api/book-issue/deleteAllById", { data: data });

export default {
  getAll,
  getIssueRequestByStudentId,
  updateIssueRequest,
  approveBooksIssueRequest,
  rejectBooksIssueRequest,
  deleteAll,
};
