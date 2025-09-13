import trainerModel from "../models/trainer.model.js";
import batchModel from "../models/batch.model.js";
import studentModel from "../models/student.model.js";
import assessmentModel from "../models/assessment.model.js";
import projectModel from "../models/project.model.js";
import toastmasterModel from "../models/toastmaster.model.js";
import saturdaySessionModel from "../models/saturdaySession.model.js";
import timetableModel from "../models/timetable.model.js";
import pdfModel from "../models/pdf.model.js";
import { model } from "mongoose";

//GET
const getAllService = async () => {
  const batches = await batchModel
    .find()
    .populate({
      path: "students",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "technicalTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "softskillTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "aptitudeTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (batches.length === 0)
    return { success: true, message: "batches is not present" };

  return { success: true, message: "Successful", batches };
};

const getBatchByIdService = async (id) => {
  const batch = await batchModel
    .findById(id)
    .populate({
      path: "students",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "technicalTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "softskillTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "aptitudeTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (!batch) return { success: false, message: "batch is not present" };

  return { success: true, message: "Successful", data: batch };
};

const nonAssignedbatchesbyTypeOfTrainerService = async (typeOfTrainer) => {
  if (!typeOfTrainer) {
    return {
      success: false,
      message: "Trainer type is required",
    };
  }

  let query = {};

  switch (typeOfTrainer) {
    case "technical":
      query = { technicalTrainer: null };
      break;
    case "softskill":
      query = { softskillTrainer: null };
      break;
    case "aptitude":
      query = { aptitudeTrainer: null };
      break;
    default:
      return { success: false, message: "Invalid trainer type" };
  }

  const batches = await batchModel.find(query);

  if (batches.length === 0) {
    return {
      success: true,
      message: `All batches are assigned for ${typeOfTrainer} trainer`,
    };
  }

  return {
    success: true,
    message: "Unassigned batches fetched successfully",
    batches1: batches,
  };
};

//POST
const fetchAllNonAssignedBatchesForAssignNewBatchesService = async (
  id,
  type_Of_Trainer
) => {
  if (!type_Of_Trainer || !id)
    return {
      success: false,
      message: "Trainer ID and trainer type are required",
    };

  let field = "";

  switch (type_Of_Trainer) {
    case "technical":
      field = "technicalTrainer";
      break;
    case "softskill":
      field = "softskillTrainer";
      break;
    case "aptitude":
      field = "aptitudeTrainer";
      break;
    default:
      return {
        success: false,
        message: "Invalid trainer type",
      };
  }
  const batches1 = await batchModel.find({
    $or: [
      { [field]: { $ne: id } }, // assigned to someone else
      { [field]: { $exists: false } }, // not assigned at all
      { [field]: null }, // explicitly null
    ],
  });

  if (batches1.length === 0)
    return {
      success: true,
      message: `All batches are already assigned to this ${type_Of_Trainer} trainer`,
    };

  return {
    success: true,
    message: "Batches fetched successfully",
    batches: batches1,
  };
};

const addBatchService = async ({
  batch_Name,
  batch_No,
  status,
  start_Date,
  end_Date,
  technicalTrainer,
  softskillTrainer,
  aptitudeTrainer,
}) => {
  const existingBatch = await batchModel.findOne({ batch_No });
  if (existingBatch) {
    return {
      success: false,
      message: `Batch is already present with No ${batch_No}`,
    };
  }

  // 2. Create new batch
  const batch = await new batchModel({
    batch_Name,
    batch_No,
    status,
    start_Date,
    end_Date,
    technicalTrainer,
    softskillTrainer,
    aptitudeTrainer,
  }).save();

  const trainerIds = [
    { id: technicalTrainer, label: "technicalTrainer" },
    { id: softskillTrainer, label: "softskillTrainer" },
    { id: aptitudeTrainer, label: "aptitudeTrainer" },
  ];

  for (const { id } of trainerIds) {
    if (id) {
      const trainer = await trainerModel.findById(id);
      if (trainer) {
        trainer.assigned_Batches = trainer.assigned_Batches || [];
        trainer.assigned_Batches.push(batch._id);
        await trainer.save();
      }
    }
  }

  return {
    success: true,
    message: `Batch is created with No ${batch_No}`,
    data: batch,
  };
};

//PUT
const addStudentsInBatchService = async ({ batchId, studentsIds }) => {
  const batch = await batchModel
    .findByIdAndUpdate(
      batchId,
      {
        $addToSet: { students: { $each: studentsIds } },
      },
      {
        new: true,
      }
    )
    .populate({
      path: "students",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "technicalTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "softskillTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "aptitudeTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (!batch) return { success: false, message: "Batch is not present" };

  await studentModel.updateMany(
    { _id: { $in: studentsIds } },
    { $set: { assigned_batch: batch._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  return { success: true, message: "Students added", data: batch };
};

const removeStudentsFromBatchService = async ({ batchId, studentsIds }) => {
  const batch = await batchModel
    .findByIdAndUpdate(
      batchId,
      {
        $pull: { students: { $in: studentsIds } },
      },
      {
        new: true,
      }
    )
    .populate({
      path: "students",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "technicalTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "softskillTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "aptitudeTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (!batch) return { success: false, message: "Batch is not present" };

  await studentModel.updateMany(
    { _id: { $in: studentsIds } },
    { $set: { assigned_batch: null } }
  );

  return { success: true, message: "Students Removed", data: batch };
};

const assignNewByTypeOfTrainerService = async ({
  batchId,
  typeOfTrainer,
  trainerId,
}) => {
  const trainerFieldMap = {
    technical: "technicalTrainer",
    softskill: "softskillTrainer",
    aptitude: "aptitudeTrainer",
  };

  const trainerField = trainerFieldMap[typeOfTrainer.toLowerCase()];

  if (!trainerField) {
    return { success: false, message: "Invalid trainer type" };
  }

  const batch = await batchModel
    .findByIdAndUpdate(
      batchId,
      {
        $set: {
          [trainerField]: trainerId,
        },
      },
      { new: true }
    )
    .populate({
      path: "students",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "technicalTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "softskillTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "aptitudeTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (!batch) return { success: false, message: "Batch not found" };

  const trainer = await trainerModel.findByIdAndUpdate(
    trainerId,
    {
      $addToSet: { assigned_Batches: batchId },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return { success: true, message: "Trainer Assigned", data: batch };
};

const removeTrainerFromBatchByTypeOfTrainerService = async ({
  id,
  typeOfTrainer,
}) => {
  const trainerFieldMap = {
    technical: "technicalTrainer",
    softskill: "softskillTrainer",
    aptitude: "aptitudeTrainer",
  };

  const trainerField = trainerFieldMap[typeOfTrainer.toLowerCase()];

  if (!trainerField) {
    return { success: false, message: "Invalid trainer type" };
  }

  const batch = await batchModel
    .findByIdAndUpdate(
      id,
      {
        $set: { [trainerField]: null },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate({
      path: "students",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "technicalTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "softskillTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "aptitudeTrainer",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (!batch) return { success: false, message: "Batch is not present" };

  await trainerModel.updateOne(
    { _id: batch[trainerField] },
    {
      $pull: { assigned_Batches: batch._id },
    }
  );

  return { success: true, message: "Trainer removed", data: batch };
};

const editBatchService = async ({
  id,
  batch_Name,
  batch_No,
  status,
  start_Date,
  end_Date,
  technicalTrainer,
  softskillTrainer,
  aptitudeTrainer,
}) => {
  const batch = await batchModel.findById(id);
  if (!batch) return { success: false, message: "Batch is not present" };

  const oldTrainerIds = [
    batch.technicalTrainer?.toString(),
    batch.softskillTrainer?.toString(),
    batch.aptitudeTrainer?.toString(),
  ];

  const newTrainerIds = [
    technicalTrainer?.toString(),
    softskillTrainer?.toString(),
    aptitudeTrainer?.toString(),
  ];

  // Set to store unique old trainer IDs
  const uniqueOldTrainerIds = [...new Set(oldTrainerIds)].filter(Boolean);

  // Set to store unique new trainer IDs
  const uniqueNewTrainerIds = [...new Set(newTrainerIds)].filter(Boolean);

  // Remove batch from old trainers ONLY if they are not in any new roles
  for (const oldId of uniqueOldTrainerIds) {
    if (!uniqueNewTrainerIds.includes(oldId)) {
      await trainerModel.findByIdAndUpdate(oldId, {
        $pull: { assigned_Batches: id },
      });
    }
  }

  // Add batch to newly assigned trainers if not already there
  for (const newId of uniqueNewTrainerIds) {
    await trainerModel.findByIdAndUpdate(newId, {
      $addToSet: { assigned_Batches: id },
    });
  }

  // Update batch document
  batch.batch_Name = batch_Name;
  batch.batch_No = batch_No;
  batch.status = status;
  batch.start_Date = start_Date;
  batch.end_Date = end_Date;
  batch.technicalTrainer = technicalTrainer;
  batch.softskillTrainer = softskillTrainer;
  batch.aptitudeTrainer = aptitudeTrainer;

  await batch.save();

  return {
    success: true,
    message: "Batch and trainer assignments updated successfully",
    data: batch,
  };
};

const deleteBatchesService = async (ids) => {
  const batches = await batchModel.find({ _id: { $in: ids } });

  if (batches.length === ids.length)
    return { success: false, message: "one of the batches is not present" };

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    await studentModel.updateMany(
      { assigned_batch: id },
      { $set: { assigned_batch: null } }
    );

    await trainerModel.updateMany(
      { assigned_Batches: id },
      { $pull: { assigned_Batches: id } }
    );

    await assessmentModel.updateMany(
      { batchId: id },
      {
        $set: { batchId: null },
      }
    );

    await projectModel.updateMany(
      { batchId: id },
      {
        $set: { batchId: null },
      }
    );

    await toastmasterModel.updateMany(
      { batch: id },
      {
        $set: { batch: null },
      }
    );

    await saturdaySessionModel.updateMany(
      { batchIds: id },
      {
        $pull: { batchIds: id },
      }
    );

    await timetableModel.updateMany(
      { batchId: id },
      {
        $set: { batchId: null },
      }
    );

    await pdfModel.updateMany(
      { targetBatchIds: id },
      {
        $pull: { targetBatchIds: id },
      }
    );
  }

  await batchModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "batch  deleted successfully" };
};

export default {
  getAllService,
  addBatchService,
  fetchAllNonAssignedBatchesForAssignNewBatchesService,
  nonAssignedbatchesbyTypeOfTrainerService,
  getBatchByIdService,
  addStudentsInBatchService,
  removeStudentsFromBatchService,
  removeTrainerFromBatchByTypeOfTrainerService,
  editBatchService,
  assignNewByTypeOfTrainerService,
  deleteBatchesService,
};
