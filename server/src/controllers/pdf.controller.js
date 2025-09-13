import { request, response } from "express";
import pdfService from "../services/pdf.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getAll = async (request, response) => {
  try {
    const result = await pdfService.getAllService();

    result.success
      ? response.status(200).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllPDFByTrainerId", error);
  }
};

const getAllPDFByTrainerId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await pdfService.getAllPDFByTrainerIdService(id);

    result.success
      ? response.status(200).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllPDFByTrainerId", error);
  }
};

const getAllPDFByStuentId = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await pdfService.getAllPDFByStuentIdService(id);

    result.success
      ? response.status(200).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllPDFByStuentId", error);
  }
};

//POST
const addPDF = async (request, response) => {
  try {
    const { trainerId } = request.params;
    const { title, fileType, targetBatchIds } = request.body;
    const file = request.file;

    let batchArray;
    try {
      batchArray =
        typeof targetBatchIds === "string"
          ? JSON.parse(targetBatchIds)
          : targetBatchIds;
    } catch {
      batchArray = [];
    }

    const payLoad = {
      uploadedBy: trainerId.trim(),
      title,
      fileType,
      file,
      targetBatchIds: batchArray,
    };

    console.log(payLoad);

    const result = await pdfService.addPDFService(payLoad);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addPDF", error);
  }
};

const updatePDF = async (request, response) => {
  try {
    const { id, title, targetBatchIds } = request.body;

    const payLoad = {
      id,
      title,
      targetBatchIds,
    };

    const result = await pdfService.updatePDFService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updatePDF", error);
  }
};

const deletePDFsByIds = async (request,response) => {
   try {
    const { ids } = request.body;

    const result = await pdfService.deletePDFsByIdsService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deletePDFsByIds", error);
  }
}

export default {
  getAll,
  getAllPDFByTrainerId,
  getAllPDFByStuentId,
  addPDF,
  updatePDF,
  deletePDFsByIds
};
