import { request, response } from "express";
import timetableService from "../services/timetable.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getAll = async (request, response) => {
  try {
    const result = await timetableService.getAllService();

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll timetable ", error);
  }
};

const getAllByStudentId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await timetableService.getAllByStudentIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll timetable ", error);
  }
};

const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await timetableService.getByIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "get timetable ById", error);
  }
};

//POST
const addTimeTable = async (request, response) => {
  try {
    const { Name, uploadedBy, batchId } = request.body;
    const file = request.file;

    const payLoad = {
      uploadedBy: uploadedBy.trim(),
      batchId: batchId.trim(),
      Name,
      file,
    };

    const result = await timetableService.addTimeTableService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addTimeTable", error);
  }
};

const editTimeTable = async (request, response) => {
  try {
    const { Name, batchId } = request.body;
    const { id } = request.params;
    const file = request.file;

    const payLoad = {
      id: id,
      batchId: batchId.trim(),
      Name,
      file,
    };

    const result = await timetableService.editTimeTableService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addTimeTable", error);
  }
};

//DELETE
const deleteById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await timetableService.deleteByIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "delete timetable by id", error);
  }
};

const deleteByIds = async (request, response) => {
  try {
    const { ids } = request.body;
    const result = await timetableService.deleteByIdsService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "delete timetable by ids", error);
  }
};

export default {
  getAll,
  getAllByStudentId,
  getById,
  addTimeTable,
  editTimeTable,
  deleteById,
  deleteByIds,
};
