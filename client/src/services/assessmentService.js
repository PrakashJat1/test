import axios from "@/utils/axios";

const getAllAssessments = () => axios.get("/api/assessment/getAll");

const getAllAssessmentsByTrainerId = (id) => axios.get(`/api/assessment/getAllByTrainerId/${id}`);

const getAllByBatchId = (id) =>  axios.get(`/api/assessment/getAllByBatchId/${id}`);

const getBatchAndMonthWiseAssessmentPerformanceForChart = async () => {
  return await axios.get(
    "/api/assessment/getBatchAndMonthWiseAssessmentPerformanceForChart"
  );
};

const createAssessment = async (data) =>
  axios.post(
    `/api/assessment/createAssessment/${data.trainerId}/${data.batchId}`,
    data
  );

const updateAssessmentMarks = async (data) =>
  axios.put(`/api/assessment/updateAssessmentMarks/${data.assessmentId}`, data);

const deleteAssesments = (data) =>
  axios.delete("/api/assessment/deleteAssessments", { data: data });

export default {
  getAllAssessments,
  getAllAssessmentsByTrainerId,
  getAllByBatchId,
  getBatchAndMonthWiseAssessmentPerformanceForChart,
  createAssessment,
  updateAssessmentMarks,
  deleteAssesments,
};
