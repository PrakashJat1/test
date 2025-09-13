import { InternalServerError } from "../utils/error.util.js";
import studentService from "../services/student.service.js";
import { request, response } from "express";

//GET
const getAll = async (request, response) => {
  try {
    const result = await studentService.getAllService();
    result.success
      ? response.status(201).json(result.students)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Add Student", error);
  }
};

const getStudentByUserId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await studentService.getStudentByUserIdService(id);
    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getStudentByUserId", error);
  }
};

//POST
const addStudent = async (request, response) => {
  try {
    const result = await studentService.addStudentService(request.body);
    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Add Student", error);
  }
};

//PUT

const assignBatch = async (request, response) => {
  try {
    const { studentsIds, batchId } = request.body;

    const payLoad = {
      studentsIds,
      batchId,
    };

    const result = await studentService.assignBatchService(payLoad);
    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Batch Assigned", error);
  }
};

const updateStudentsPlacementStatus = async (request, response) => {
  try {
    const { studentsIds, placementStatus } = request.body;
    const payLoad = {
      studentsIds,
      placementStatus,
    };

    const result = await studentService.updateStudentsPlacementStatusService(
      payLoad
    );
    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Placement status Updated", error);
  }
};

//DELETE
const deleteStudent = async (request, response) => {
  try {
    const { id } = request.params.id;
    const result = await studentService.deleteStudentService(id);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteStudent", error);
  }
};

export default {
  getAll,
  getStudentByUserId,
  addStudent,
  assignBatch,
  updateStudentsPlacementStatus,
  deleteStudent,
};
