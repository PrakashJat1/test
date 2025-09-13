import axios from "@/utils/axios";
import { data } from "react-router-dom";

const getAll = () => axios.get("/api/student/getAll");
const getStudentByUserId = (id) =>
  axios.get(`/api/student/getStudentByUserId/${id}`);
const addStudent = (data) => axios.post("/api/student/addStudent", data);
const assignBatch = (data) => axios.put("/api/student/assignBatch", data);
const updateStudentPlacementStatusByIds = (data) =>
  axios.put(`/api/student/updateStudentsPlacementStatus`, data);
const deleteStudentById = (id) =>
  axios.delete(`/api/student/deleteStudent/${id}`);

export default {
  getAll,
  getStudentByUserId,
  addStudent,
  assignBatch,
  updateStudentPlacementStatusByIds,
  deleteStudentById,
};
