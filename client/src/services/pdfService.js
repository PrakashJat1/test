import axios from "@/utils/axios";

const getAllPDFs = () => axios.get("/api/pdf/getAll");

const getAllPDFByTrainerId = (id) =>
  axios.get(`/api/pdf/getAllPDFByTrainerId/${id}`);

const getAllPDFByStudentId = (id) =>
  axios.get(`/api/pdf/getAllPDFByStudentId/${id}`);

const addPDF = (data, trainerId) =>
  axios.post(`/api/pdf/addPDF/${trainerId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const updatePDF = (data) => axios.put("/api/pdf/updatePDF", data);

const deletePDFsByIds = (data) =>
  axios.delete("/api/pdf/deletePDFsByIds", { data: data });

export default {
  getAllPDFs,
  getAllPDFByTrainerId,
  getAllPDFByStudentId,
  addPDF,
  updatePDF,
  deletePDFsByIds,
};
