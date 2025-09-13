import bcrypt from "bcryptjs";
import trainer from "../models/trainer.model.js";
import user from "../models/user.model.js";
import trainerModel from "../models/trainer.model.js";
import batchModel from "../models/batch.model.js";
import assessmentModel from "../models/assessment.model.js";
import pdfModel from "../models/pdf.model.js";
import userModel from "../models/user.model.js";
import batchService from "./batch.service.js";

//GET

const getAllService = async () => {
  const trainers = await trainerModel
    .find()
    .populate("userId")
    .populate("assigned_Batches");

  if (trainers.length === 0)
    return { success: true, message: "Trainers list is empty" };

  return { success: true, message: "Successful", data: trainers };
};

const getTrainerByIdService = async (id) => {
  const trainer = await trainerModel
    .findById(id)
    .populate("userId")
    .populate("assigned_Batches");

  if (!trainer) return { success: false, message: "Trainer is not present" };

  return { success: true, message: "Successful", data: trainer };
};

const getTrainerByUserIdService = async (id) => {
  const trainer = await trainerModel
    .find({ userId: id })
    .populate("userId")
    .populate("assigned_Batches");

  if (!trainer) return { success: false, message: "Trainer is not present" };

  return { success: true, message: "Successful", data: trainer };
};
//POST
const addTrainerService = async ({
  fullName,
  email,
  password,
  mobileNo,
  type_Of_Trainer,
  assigned_Batches,
  specialization,
}) => {
  const existinguser = await userModel.findOne({ email: email });

  if (existinguser)
    return {
      success: false,
      message: `User is already present using ${email}`,
    };
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    fullName,
    email,
    password: hashedPassword,
    mobileNo,
    role: "trainer",
    status: true,
    isverified: true,
  });

  await newUser.save();

  const newTrainer = new trainerModel({
    userId: newUser._id,
    type_Of_Trainer: type_Of_Trainer,
    assigned_Batches: assigned_Batches, //need to complete
    specialization: specialization,
  }).save();

  return {
    success: true,
    message: `Trainer created successfully`,
  };
};

//PUT
const assignBatchesService = async ({
  trainerId,
  type_Of_Trainer,
  batchIds,
}) => {
  const trainer = await trainerModel.findById(trainerId);
  if (!trainer) return { success: false, message: "Trainer is not present" };

  let trainerField = "";
  switch (type_Of_Trainer) {
    case "technical":
      trainerField = "technicalTrainer";
      break;
    case "softskill":
      trainerField = "softskillTrainer";
      break;
    case "aptitude":
      trainerField = "aptitudeTrainer";
      break;
    default:
      return { success: false, message: "Invalid trainer type" };
  }

  const batches = await batchModel.find({ _id: { $in: batchIds } });
  if (batches.length !== batchIds.length) {
    return { success: false, message: "One or more batches are not present" };
  }

  for (const batch of batches) {
    const previousTrainerId = batch[trainerField];

    if (previousTrainerId && previousTrainerId.toString() !== trainerId) {
      await trainerModel.updateOne(
        { _id: previousTrainerId },
        { $pull: { assigned_Batches: batch._id } }
      );
    }
  }

  // STEP 2: Add batchIds to current trainer’s assigned_Batches
  await trainerModel.updateOne(
    { _id: trainerId },
    {
      $addToSet: { assigned_Batches: { $each: batchIds } },
    }
  );

  // STEP 3: Set the trainer on the batch
  await batchModel.updateMany(
    { _id: { $in: batchIds } },
    { $set: { [trainerField]: trainerId } }
  );

  return { success: true, message: "Batches assigned successfully." };
};

const removeAssignedBatchesService = async ({
  trainerId,
  type_Of_Trainer,
  batchIds,
}) => {
  const trainer = await trainerModel.findById(trainerId);
  if (!trainer) return { success: false, message: "trainer is not present" };

  let query = {};

  switch (type_Of_Trainer) {
    case "technical":
      query = "technicalTrainer";
      break;
    case "softskill":
      query = "softskillTrainer";
      break;
    case "aptitude":
      query = "aptitudeTrainer";
      break;
    default:
      return { success: false, message: "Invalid trainer type" };
  }

  await trainerModel.updateOne(
    { _id: trainerId },
    {
      $pull: { assigned_Batches: { $in: batchIds } },
    }
  );

  const batches = await batchModel.find({ _id: { $in: batchIds } });

  if (batches.length !== batchIds.length)
    return { success: false, message: "One of the batch is not present" };

  await batchModel.updateMany(
    { _id: { $in: batchIds } },
    {
      $unset: { [query]: "" },
    }
  );

  return { success: true, message: "Batch removed successfully" };
};

//PUT
// const assigneBatchesToTrainer = async ()

//DELETE
const deleteTrainerService = async (id) => {
  const trainer = await trainerModel.findById(id);

  if (!trainer) return { success: false, message: "trainer not exist" };

  switch (trainer.type_Of_Trainer) {
    case "technical":
      await batchModel.updateMany(
        { technicalTranier: id },
        {
          $set: { technicalTranier: null },
        }
      );
      break;
    case "softskill":
      await batchModel.updateMany(
        { softskillTranier: id },
        {
          $set: { softskillTranier: null },
        }
      );

      break;
    case "aptitude":
      await batchModel.updateMany(
        { aptitudeTranier: id },
        {
          $set: { aptitudeTranier: null },
        }
      );
      break;

    default:
      break;
  }

  await trainerModel.deleteOne({ _id: trainer._id });

  await assessmentModel.updateMany(
    { createdBy: id },
    {
      $set: { createdAt: null },
    }
  );

  await pdfModel.updateMany(
    { uploadedBy: id },
    {
      $set: { uploadedBy: null },
    }
  );
};

export default {
  getAllService,
  getTrainerByIdService,
  getTrainerByUserIdService,
  addTrainerService,
  assignBatchesService,
  removeAssignedBatchesService,
  deleteTrainerService,
};
