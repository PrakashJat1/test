import { request, response } from "express";
import companyService from "../services/company.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await companyService.getByIdService(id);
    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getById", error);
  }
};

const getAllCompaniesDrive = async (request, response) => {
  try {
    const result = await companyService.getAllCompaniesDriveService();
    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllCompaniesDrive", error);
  }
};

const getAllByBatchId = async (request, response) => {
  try {
    const { batchId } = request.params;
    const result = await companyService.getAllByBatchIdService(batchId);
    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllCompaniesDrive", error);
  }
};

//POST
const addCompany = async (request, response) => {
  try {
    const { uploadedBy } = request.params;
    const {
      name,
      roleOffered,
      packageOffered,
      driveDate,
      websiteLink,
      roundsInfo,
      batchIds,
    } = request.body;

    const payLoad = {
      uploadedBy: uploadedBy.trim(),
      name,
      roleOffered,
      packageOffered,
      driveDate,
      websiteLink: websiteLink.trim(),
      roundsInfo,
      batchIds,
    };

    const result = await companyService.addCompanyService(payLoad);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addCompany", error);
  }
};

//PUT
const updatedById = async (request, response) => {
  try {
    const { id } = request.params;
    const {
      name,
      roleOffered,
      packageOffered,
      driveDate,
      websiteLink,
      roundsInfo,
      batchIds,
    } = request.body;

    const payLoad = {
      id: id.trim(),
      name,
      roleOffered,
      packageOffered,
      driveDate,
      websiteLink: websiteLink.trim(),
      roundsInfo,
      batchIds,
    };

    const result = await companyService.updateByIdService(payLoad);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updatedById", error);
  }
};

//DELETE
const deleteById = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await companyService.deleteByIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteById", error);
  }
};

const deleteAllByIds = async (request, response) => {
  try {
    const { ids } = request.body;

    const result = await companyService.deleteAllByIdsService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteAllByIds", error);
  }
};

export default {
  getById,
  getAllCompaniesDrive,
  getAllByBatchId,
  addCompany,
  updatedById,
  deleteById,
  deleteAllByIds,
};
