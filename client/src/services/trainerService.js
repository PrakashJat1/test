import axios from "@/utils/axios";

const getAll = () => axios.get("/api/trainer/getAll");
const getTrainerById = (id) => axios.get(`/api/trainer/getTrainerById/${id}`);
const getTrainerByUserId = (id) =>
  axios.get(`/api/trainer/getTrainerByUserId/${id}`);
const addTrainer = (data) => axios.post("/api/trainer/add-trainer", data);
const assignBatches = (data) => axios.put("/api/trainer/assignBatches", data);
const removeAssignedBatches = (data) =>
  axios.put("/api/trainer/removeAssignedBatches", data);
const deleteTrainerById = (id) =>
  axios.delete(`/api/trainer/deleteTrainer/${id}`);

// /removeAssignedBatches

export default {
  getAll,
  getTrainerById,
  getTrainerByUserId,
  addTrainer,
  assignBatches,
  removeAssignedBatches,
  deleteTrainerById,
};
