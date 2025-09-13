import { request, response } from "express";
import batchService from "../services/batch.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET

const getAll = async (request, response) => {
  try {
    const result = await batchService.getAllService();
    result.success
      ? response.status(201).json(result.batches)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAll", error);
  }
};

const getBatchById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await batchService.getBatchByIdService(id);
    result.success
      ? response.status(201).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getBatchById", error);
  }
};

const fetchAllNonAssignedBatchesForAssignNewBatches = async (
  request,
  response
) => {
  try {
    const { id, type_Of_Trainer } = request.body;

    const result =
      await batchService.fetchAllNonAssignedBatchesForAssignNewBatchesService(
        id,
        type_Of_Trainer
      );
    result.success
      ? response.status(201).json(result.batches)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(
      response,
      "fetchAllNonAssignedBatchesForAssignNewBatches",
      error
    );
  }
};

const nonAssignedbatchesbyTypeOfTrainer = async (request, response) => {
  try {
    const { type_Of_Trainer } = request.body;
    const result = await batchService.nonAssignedbatchesbyTypeOfTrainerService(
      type_Of_Trainer
    );
    result.success
      ? response.status(201).json(result.batches1)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "nonAssignedbatchesbyTypeOfTrainer", error);
  }
};

//POST
const addBatch = async (request, response) => {
  try {
    const result = await batchService.addBatchService(request.body);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    response.status(500).json("Error in addbatch", error);
    console.log("Error in addbatch", error);
  }
};

//PUT
const addStudentsInBatch = async (request, response) => {
  try {
    const { batchId } = request.params;
    const { studentsIds } = request.body;

    const payLoad = {
      batchId: batchId.trim(),
      studentsIds,
    };

    const result = await batchService.addStudentsInBatchService(payLoad);
    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addStudentsInBatch", error);
  }
};

const removeStudentsFromBatch = async (request, response) => {
  try {
    const { batchId } = request.params;
    const { studentsIds } = request.body;

    const payLoad = {
      batchId: batchId.trim(),
      studentsIds,
    };

    const result = await batchService.removeStudentsFromBatchService(payLoad);
    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "remove Students from Batch", error);
  }
};

const assignNewByTypeOfTrainer = async (request, response) => {
  try {
    const { batchId } = request.params;
    const { typeOfTrainer, trainerId } = request.body;

    const payLoad = {
      batchId,
      typeOfTrainer,
      trainerId,
    };

    const result = await batchService.assignNewByTypeOfTrainerService(payLoad);

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "assignNewByTypeOfTrainer", error);
  }
};

const removeTrainerFromBatchByTypeOfTrainer = async (request, response) => {
  try {
    const { id } = request.params;
    const { typeOfTrainer } = request.body;

    const payLoad = {
      id,
      typeOfTrainer,
    };

    const result =
      await batchService.removeTrainerFromBatchByTypeOfTrainerService(payLoad);

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(
      response,
      "removeTrainerFromBatchByTypeOfTrainer",
      error
    );
  }
};

const editBatch = async (request, response) => {
  try {
    const {
      id,
      batch_Name,
      batch_No,
      status,
      start_Date,
      end_Date,
      technicalTrainer,
      softskillTrainer,
      aptitudeTrainer,
    } = request.body;

    const payLoad = {
      id,
      batch_Name,
      batch_No,
      status,
      start_Date,
      end_Date,
      technicalTrainer,
      softskillTrainer,
      aptitudeTrainer,
    };

    const result = await batchService.editBatchService(payLoad);

    result.success
      ? response.status(200).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "editBatch", error);
  }
};

//DELETE
const deleteBatches = async (request, response) => {
  try {
    const { ids } = request.body;
    const result = await batchService.deleteBatchesService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteBatches", error);
  }
};

export default {
  getAll,
  addBatch,
  fetchAllNonAssignedBatchesForAssignNewBatches,
  nonAssignedbatchesbyTypeOfTrainer,
  getBatchById,
  addStudentsInBatch,
  removeStudentsFromBatch,
  removeTrainerFromBatchByTypeOfTrainer,
  editBatch,
  assignNewByTypeOfTrainer,
  deleteBatches,
};
