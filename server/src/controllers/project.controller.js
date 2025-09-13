import { request, response } from "express";
import projectService from "../services/project.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getAllProjects = async (request, response) => {
  try {
    const result = await projectService.getAllProjectsService();

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllProjects", error);
  }
};

const getProjectById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await projectService.getProjectByIdService(id);

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getProjectById", error);
  }
};

const getAllProjectsByStudentId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await projectService.getAllProjectsByStudentIdService(id);

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllProjectsByStudentId", error);
  }
};

const getAllProjectsByBatchIds = async (request, response) => {
  try {
    const { batchIds } = request.body;
    const result = await projectService.getAllProjectsByBatchIdsService(
      batchIds
    );

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllProjectsByBatchIds", error);
  }
};

//POST
const addProject = async (request, response) => {
  try {
    const { studentId } = request.params;
    const { title, githubLink } = request.body;
    const payLoad = {
      studentId: studentId.trim(),
      title,
      githubLink : githubLink.trim(),
    };
    const result = await projectService.addProjectService(payLoad);
    result
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addBook", error);
  }
};

//PUT
const updateFeedbackById = async (request, response) => {
  try {
    const { id } = request.params;
    const { feedback } = request.body;

    const payLoad = {
      id,
      feedback,
      role: request.user.role,
    };
    const result = await projectService.updateFeedbackByIdService(payLoad);
    result
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateFeedbackById", error);
  }
};

//DELETE
const deleteProjectsByIds = async (request, response) => {
  try {
    const { ids } = request.body;
    const result = await projectService.deleteProjectsByIdsService(ids);

    result.success
      ? response.status(200).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteProjectsByIds", error);
  }
};
export default {
  getAllProjects,
  getProjectById,
  getAllProjectsByStudentId,
  getAllProjectsByBatchIds,
  addProject,
  updateFeedbackById,
  deleteProjectsByIds,
};
