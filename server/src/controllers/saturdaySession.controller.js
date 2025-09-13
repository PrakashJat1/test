import { request, response } from "express";
import saturdaySessionService from "../services/saturdaySession.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getAll = async (request, response) => {
  try {
    const result = await saturdaySessionService.getAllService();

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll", error);
  }
};

const getAllSaturdaySessionsByStudentId = async (request, response) => {
  try {
    const result =
      await saturdaySessionService.getAllSaturdaySessionsByStudentIdService(
        request.params.id
      );

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllSaturdaySessionsByStudentId", error);
  }
};

//POST
const addSaturdaySession = async (request, response) => {
  try {
    const {
      uploadedBy,
      date,
      topic,
      ExpertName,
      company,
      position,
      timeFrom,
      timeTo,
      batchIds,
    } = request.body;

    const payLoad = {
      uploadedBy: uploadedBy.trim(),
      date,
      topic,
      ExpertName,
      company,
      position,
      timeFrom,
      timeTo,
      batchIds,
    };

    const result = await saturdaySessionService.addSaturdaySessionService(
      payLoad
    );

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Add saturday session", error);
  }
};

//PUT
const updateById = async (request, response) => {
  try {
    const { id } = request.params;
    const {
      date,
      topic,
      ExpertName,
      company,
      position,
      timeFrom,
      timeTo,
      batchIds,
    } = request.body;

    const payLoad = {
      id,
      date,
      topic,
      ExpertName,
      company,
      position,
      timeFrom,
      timeTo,
      batchIds,
    };

    const result = await saturdaySessionService.updateByIdService(payLoad);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updated saturday session", error);
  }
};

const giveFeedback = async (request, response) => {
  try {
    const { studentId, sessionId } = request.params;
    const { feedback } = request.body;
    const payLoad = {
      studentId,
      sessionId,
      feedback,
    };
    const result = await saturdaySessionService.giveFeedbackService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updated saturday session", error);
  }
};

//DELETE
const deleteByIds = async (request, response) => {
  try {
    const { ids } = request.body;

    const result = await saturdaySessionService.deleteByIdsService(ids);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteByIdsService", error);
  }
};

export default {
  getAll,
  getAllSaturdaySessionsByStudentId,
  addSaturdaySession,
  updateById,
  giveFeedback,
  deleteByIds,
};
