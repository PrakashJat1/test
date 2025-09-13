import { request, response } from "express";
import itepapplicantService from "../services/itepapplicant.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getAll = async (request, response) => {
  try {
    const result = await itepapplicantService.getAllService();

    result.success
      ? response.status(200).json(result.data)
      : response.status(204).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll applicants", error);
  }
};

const getCurrentMonthRegisteredApplicants = async (request, response) => {
  try {
    const result =
      await itepapplicantService.getCurrentMonthRegisteredApplicantsService();

    result.success
      ? response.status(200).json(result.data)
      : response.status(204).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll current month applicants", error);
  }
};

//PUT
const updateApplicantsStatusForExam = async (request, response) => {
  try {
    const { examAllowed, ids, reason } = request.body;
    const payLoad = {
      examAllowed,
      ids,
      reason,
    };
    const result =
      await itepapplicantService.updateApplicantsStatusForExamService(payLoad);

    result.success
      ? response.status(200).json(result?.message)
      : response.status(204).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateApplicantStatusForExam", error);
  }
};

const updateApplicantsStatusForSelection = async (request, response) => {
  try {
    const { status, ids, batchId } = request.body;
    const payLoad = {
      status,
      ids,
      batchId,
    };
    const result =
      await itepapplicantService.updateApplicantsStatusForSelectionService(
        payLoad
      );

    result.success
      ? response.status(200).json(result.message)
      : response.status(204).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateApplicantStatusForSelection", error);
  }
};

//DELETE
const deleteApplicants = async (request, response) => {
  try {
    const { ids } = request.body;
    const result = await itepapplicantService.deleteApplicantsService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteApplicant", error);
  }
};

export default {
  getAll,
  getCurrentMonthRegisteredApplicants,
  updateApplicantsStatusForExam,
  updateApplicantsStatusForSelection,
  deleteApplicants,
};
