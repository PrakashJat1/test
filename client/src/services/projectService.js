import axios from "@/utils/axios";

const getAllProjects = () => axios.get("/api/project/getAllProjects");

const getAllProjectsByStudentId = (id) =>
  axios.get(`/api/project/getAllProjectsByStudentId/${id}`);

// const getAllProjectsByTrainerId = (id) =>
//   axios.get(`/api/project/getAllProjectsByStudentId${id}`);

const getAllProjectsByBatchIds = (data) =>
  axios.post(`/api/project/getAllProjectsByBatchIds`, data);

const addProject = (data) =>
  axios.post(`/api/project/addProject/${data.studentId}`, data);

const updateFeedbackById = (data) =>
  axios.put(`/api/project/updateFeedbackById/${data.id}`, data);

const deleteProjectsByIds = (data) =>
  axios.delete("/api/project/deleteProjectsByIds", { data: data });

export default {
  getAllProjects,
  getAllProjectsByStudentId,
  // getAllProjectsByTrainerId,
  getAllProjectsByBatchIds,
  addProject,
  updateFeedbackById,
  deleteProjectsByIds,
};
