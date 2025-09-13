import axios from "@/utils/axios";

const fetchUser = (id) => axios.get(`/api/user/getById/${id}`);
const getAllUsers = () => axios.get("/api/user/getAllUsers");
const verifyUser = (data) => axios.post("/api/user/verifyUser", data);
const createUser = (data) => axios.post(`/api/user/createUser`, data);
const updateUserStatusById = (data) =>
  axios.put(`/api/user/updateUserStatus`, data);
const updateUserProfileById = (data) =>
  axios.put(`/api/user/updateUserProfileById/${data.id}`, data);
const deleteUserById = (data) =>
  axios.delete(`/api/user/deleteUser`, {
    data: data,
  });

export default {
  getAllUsers,
  fetchUser,
  createUser,
  updateUserStatusById,
  updateUserProfileById,
  verifyUser,
  deleteUserById,
};
