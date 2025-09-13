import { request, response } from "express";
import assessmentService from "../services/assessment.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET

//Charts
const getBatchAndMonthWiseAssessmentPerformanceForChart = async (
  request,
  response
) => {
  try {
    const result =
      await assessmentService.getBatchAndMonthWiseAssessmentPerformanceForChartService();

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getBatchAndMonthWiseAssessmentPerformanceForChart", error);
  }
};

const getAll = async (request, response) => {
  try {
    const result = await assessmentService.getAllService();

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll", error);
  }
};

const getAllById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await assessmentService.getAllByIdService(id.trim());

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAssessmentById", error);
  }
};

const getAllByTrainerId = async (request,response) => {
  try {
    const { id } = request.params;
    const result = await assessmentService.getAllByTrainerIdService(id.trim());

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllByTrainerId", error);
  }
};

const getAllByBatchId = async (request,response) => {
  try {
    const { id } = request.params;
    const result = await assessmentService.getAllByBatchIdService(id.trim());

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllByBatchId", error);
  }
};

const getMarksByAssessmentId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await assessmentService.getMarksByAssessmentIdService(
      id.trim()
    );

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAssessmentById", error);
  }
};

const getAssessementMarksByStudentId = async (request, response) => {
  try {
    const { id } = request.params;
    const result =
      await assessmentService.getAssessementMarksByStudentIdService(id.trim());

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAssessmentMarksByStudentId", error);
  }
};

const getAllAssessmentsByStudentId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await assessmentService.getAllAssessmentsByStudentIdService(
      id.trim()
    );

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllAssessmentsByStudentId", error);
  }
};

//POST
const createAssessment = async (request, response) => {
  try {
    const { batchId, createdBy } = request.params;
    const { title, month } = request.body;
    const payLoad = {
      batchId: batchId.trim(),
      createdBy: createdBy.trim(),
      title,
      month,
    };

    const result = await assessmentService.createAssessmentService(payLoad);

    result.success
      ? response.status(201).json(result.assessment)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "createAssessment", error);
  }
};

//PUT
const updateAssessmentMarks = async (request, response) => {
  try {
    const { assessmentId } = request.params;
    const { marks } = request.body;
    const payLoad = {
      assessmentId: assessmentId.trim(),
      marks,
    };
    const result = await assessmentService.updateAssessmentMarksService(
      payLoad
    );

    result.success
      ? response.status(201).json(result.assessment)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateAssessmentMarks", error);
  }
};

//DELETE
const deleteAssesments = async (request, response) => {
  try {
    const { ids } = request.body;
    const result = await assessmentService.deleteAssessementService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteAssessments", error);
  }
};

export default {
  getBatchAndMonthWiseAssessmentPerformanceForChart,
  getAll,
  getAllByTrainerId,
  getAllByBatchId,
  getAllById,
  getMarksByAssessmentId,
  getAllAssessmentsByStudentId,
  getAssessementMarksByStudentId,
  createAssessment,
  updateAssessmentMarks,
  deleteAssesments,
};
