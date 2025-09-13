import axios from "@/utils/axios";

const getAll = () => axios.get("/api/batch/getAll");
const addBatch = (data) => axios.post("/api/batch/addBatch", data);
const fetchAllNonAssignedBatchesForAssignNewBatches = (data) =>
  axios.post("/api/batch/fetchAllNonAssignedBatchesForAssignNewBatches", data);

const nonAssignedbatchesbyTypeOfTrainer = (type_Of_Trainer) =>
  axios.post("/api/batch/nonAssignedbatchesbyTypeOfTrainer", {
    type_Of_Trainer,
  });

const editBatch = (data) => axios.put("/api/batch/editBatch", data);

const deleteBatches = (data) =>
  axios.delete("/api/batch/deleteBatches", {
    data: data,
  });

export default {
  getAll,
  addBatch,
  fetchAllNonAssignedBatchesForAssignNewBatches,
  nonAssignedbatchesbyTypeOfTrainer,
  editBatch,
  deleteBatches,
};
