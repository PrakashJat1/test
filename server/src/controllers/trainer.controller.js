import { request, response } from "express";
import trainerService from "../services/trainer.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getAll = async (request, response) => {
  try {
    const result = await trainerService.getAllService();

    result.success
      ? response.status(201).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllService", error);
  }
};

const getTrainerById = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await trainerService.getTrainerByIdService(id);

    result.success
      ? response.status(201).json(result.data)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getTrainerById", error);
  }
};

const getTrainerByUserId = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await trainerService.getTrainerByUserIdService(id);

    result.success
      ? response.status(201).json(result.data[0])
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getTrainerByUserId", error);
  }
};

//POST
const addTrainer = async (request, response) => {
  try {
    const {
      fullName,
      email,
      password,
      mobileNo,
      type_Of_Trainer,
      assigned_Batches,
      specialization,
    } = request.body;

    const payLoad = {
      fullName,
      email,
      password,
      mobileNo,
      type_Of_Trainer,
      assigned_Batches,
      specialization,
    };

    const result = await trainerService.addTrainerService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "addTrainer", error);
  }
};

//PUT
const assignBatches = async (request, response) => {
  try {
    const {trainerId,type_Of_Trainer,batchIds} = request.body;

    const payLoad = {
        trainerId,
        type_Of_Trainer,
        batchIds,
      };
    const result = await trainerService.assignBatchesService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "assignBatches", error);
  }
};

const removeAssignedBatches = async (request, response) => {
  try {
    const {trainerId,type_Of_Trainer,batchIds} = request.body;

    const payLoad = {
        trainerId,
        type_Of_Trainer,
        batchIds,
      };
    const result = await trainerService.removeAssignedBatchesService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "removeAssignedBatches", error);
  }
};

//DELETE
const deleteTrainer = async (request, response) => {
  try {
    const { id } = request.params.id;
    const result = await trainerService.deleteTrainerService(id);

    result.success
      ? response.status(201).json(result.message)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteTrainer", error);
  }
};
export default {
  getAll,
  getTrainerById,
  getTrainerByUserId,
  addTrainer,
  assignBatches,
  removeAssignedBatches,
  deleteTrainer,
};
