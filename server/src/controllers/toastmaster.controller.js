import { request, response } from "express";
import { InternalServerError } from "../utils/error.util.js";
import toastmasterModel from "../models/toastmaster.model.js";
import toastmasterService from "../services/toastmaster.service.js";

//GET
const getAll = async (request, response) => {
  try {
    const result = await toastmasterService.getAllService();

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll", error);
  }
};

const getAllSessionsByBatchId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await toastmasterService.getAllSessionsByBatchIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll", error);
  }
};

const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await toastmasterService.getByIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getById", error);
  }
};

//POST
const createToastMaster = async (request, response) => {
  try {
    const { hostedBy, batch } = request.params;
    const { date, theme, wordOfDay, idiom, roles } = request.body;

    const payLoad = {
      hostedBy,
      batch,
      date,
      theme,
      wordOfDay,
      idiom,
      roles,
    };

    const result = await toastmasterService.createToastMasterService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "createToastMaster", error);
  }
};

//PUT
const updateToastmasterRoles = async (request, response) => {
  try {
    const { id } = request.params;
    const { roles } = request.body;

    const payLoad = {
      id,
      roles,
    };

    const result = await toastmasterService.updateToastmasterRolesService(
      payLoad
    );

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateToastmasterRoles", error);
  }
};

const editToasterMasterById = async (request, response) => {
  try {
    const { id } = request.params;
    const { date, theme, wordOfDay, idiom, roles, hostedBy, batch } =
      request.body;

    const payLoad = {
      id,
      hostedBy,
      batch,
      date,
      theme,
      wordOfDay,
      idiom,
      roles,
    };

    const result = await toastmasterService.editToasterMasterByIdService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "editToasterMasterById", error);
  }
};

//DELETE
const deleteById = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await toastmasterService.deleteByIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteById", error);
  }
};

const deleteToastmasterSessions = async (request, response) => {
  try {
    const { ids } = request.body;

    const result = await toastmasterService.deleteToastmasterSessionsService(
      ids
    );

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteToastmasterSessions", error);
  }
};

export default {
  getAll,
  getById,
  getAllSessionsByBatchId,
  createToastMaster,
  updateToastmasterRoles,
  editToasterMasterById,
  deleteById,
  deleteToastmasterSessions,
};
