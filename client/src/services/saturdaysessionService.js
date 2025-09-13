import axios from "@/utils/axios";

const getAllSession = () => axios.get("/api/saturdaysession/getAll");

const getAllSaturdaySessionsByStudentId = (id) =>
  axios.get(`/api/saturdaysession/getAllSaturdaySessionsByStudentId/${id}`);

const addSession = (data) =>
  axios.post("/api/saturdaysession/addSaturdaySession", data);

const updateSessionById = (data) =>
  axios.put(`/api/saturdaysession/updateById/${data.id}`, data);

const giveFeedback = (studentId, sessionId, data) =>
  axios.put(
    `/api/saturdaysession/giveFeedback/${studentId}/${sessionId}`,
    data
  );

const deleteAllByIds = (data) =>
  axios.delete("/api/saturdaysession/deleteAllByIds", {
    data: data,
  });

export default {
  getAllSession,
  getAllSaturdaySessionsByStudentId,
  giveFeedback,
  addSession,
  updateSessionById,
  deleteAllByIds,
};
