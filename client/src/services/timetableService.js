import axios from "@/utils/axios";

const getAll = () => axios.get("/api/timetable/getAll");

const getAllByStudentId = (id) =>
  axios.get(`/api/timetable/getAllByStudentId/${id}`);

const addTimeTable = (data) => axios.post(`/api/timetable/addTimeTable`, data);
const editTimeTable = (data) =>
  axios.put(`/api/timetable/editTimeTable/${data.get("id")}`, data);
const deleteByIds = (data) =>
  axios.delete("/api/timetable/deleteByIds", { data: data });

export default {
  getAll,
  getAllByStudentId,
  addTimeTable,
  editTimeTable,
  deleteByIds,
};
