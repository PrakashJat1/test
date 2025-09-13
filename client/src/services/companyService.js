import axiosInstance from "@/utils/axios";

const getAll = () => axiosInstance.get("/api/company/getAll");
const getAllByBatchId = (id) => axiosInstance.get(`/api/company/getAllByBatchId/${id}`);
const addCompany = (data) =>
  axiosInstance.post(`/api/company/addCompany/${data.id}`, data);
const editCompany = (data) =>
  axiosInstance.put(`/api/company/updateById/${data.id}`, data);
const deleteCompanies = (data) =>
  axiosInstance.delete("/api/company/deleteAllByIds", { data: data });

export default {
  getAll,
  getAllByBatchId,
  addCompany,
  editCompany,
  deleteCompanies,
};
