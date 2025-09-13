import { request, response } from "express";
import userService from "../services/user.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET

const getAllUsers = async (request, response) => {
  try {
    const result = await userService.getAllUsersService();

    result.success
      ? response.status(201).json(result)
      : response.status(409).json(result);
  } catch (error) {
    InternalServerError(response, "getAllUsers", error);
  }
};

const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await userService.getByIdService(id);

    result.success
      ? response.status(201).json(result)
      : response.status(409).json(result);
  } catch (error) {
    InternalServerError(response, "getById", error);
  }
};

//POST
const addUser = async (request, response) => {
  try {
    const { fullName, email, password, mobileNo, role, status } = request.body;

    const payLoad = {
      fullName,
      email,
      password,
      mobileNo,
      role,
      status,
    };

    const result = await userService.addUserService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addUser", error);
  }
};

const verifyUser = async (request, response) => {
  try {
    const { id, password } = request.body;

    const payLoad = {
      id,
      password,
    };

    const result = await userService.verifyUserService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "verifyUser", error);
  }
};

//PUT
const updateUserStatus = async (request, response) => {
  try {
    const { ids, status } = request.body;
    const result = await userService.updateUserStatusService(ids, status);

    result.success
      ? response.status(200).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateUserStatus", error);
  }
};

const updateUserProfileById = async (request, response) => {
  try {
    const { id } = request.params;
    const { fullName, email, password, mobileNo } = request.body;

    const payLoad = {
      id,
      fullName,
      email,
      password,
      mobileNo,
    };

    const result = await userService.updateUserProfileByIdService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateUserProfileById", error);
  }
};

//DELETE
const deleteUser = async (request, response) => {
  try {
    const { ids } = request.body;

    const result = await userService.deleteUserService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteuser", error);
  }
};
export default {
  getAllUsers,
  getById,
  addUser,
  updateUserStatus,
  updateUserProfileById,
  verifyUser,
  deleteUser,
};
