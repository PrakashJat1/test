import axios from "@/utils/axios";

const getAll = () => axios.get("/api/itep-applicant/getAll");
const getAllCurrentMonthApplicants = () =>
  axios.get("/api/itep-applicant/getAllCurrentMonthApplicants");
const updateApplicantsStatusForExamById = (data) =>
  axios.put(`/api/itep-applicant/updateApplicantsStatusForExam`, data);
const updateApplicantsStatusForSelectionByIds = (data) =>
  axios.put(`/api/itep-applicant/updateApplicantsStatusForSelection`, data);
const deleteApplicantsById = (ids) =>
  axios.delete(`/api/itep-applicant/deleteApplicants`, { data: {ids} });

export default {
  getAll,
  getAllCurrentMonthApplicants,
  updateApplicantsStatusForExamById,
  updateApplicantsStatusForSelectionByIds,
  deleteApplicantsById,
};
