import axios from "@/utils/axios";

const getAll = () => axios.get("/api/toast-master/getAll");

const getAllSessionsByBatchId = (id) =>
  axios.get(`/api/toast-master/getAllSessionsByBatchId/${id}`);

const createToastmaster = (data) =>
  axios.post(
    `/api/toast-master/create-toastmaster/${data.hostedBy}/${data.batch}`,
    data
  );

const editToasterMasterById = (data) =>
  axios.put(`/api/toast-master/editToasterMasterById/${data.id}`, data);
const deleteToastmasterSessions = (data) =>
  axios.delete("/api/toast-master/deleteToastmasterSessions", { data: data });

export default {
  getAll,
  getAllSessionsByBatchId,
  createToastmaster,
  editToasterMasterById,
  deleteToastmasterSessions,
};
