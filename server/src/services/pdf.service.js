import { model } from "mongoose";
import batchModel from "../models/batch.model.js";
import pdfModel from "../models/pdf.model.js";
import studentModel from "../models/student.model.js";
import trainerModel from "../models/trainer.model.js";
import fileUtil from "../utils/file.util.js";

//GET
const getAllService = async () => {
  const pdf = await pdfModel
    .find()
    .populate({
      path: "uploadedBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("targetBatchIds");

  if (pdf.length === 0) return { success: true, message: "PDFs are not present" };

  return { success: true, message: "PDF's fetched successfully", data: pdf };
};

const getAllPDFByTrainerIdService = async (id) => {
  const trainer = await trainerModel.findById(id);

  if (!trainer)
    return { success: false, message: "Trainer is not present for PDF" };

  const pdf = await pdfModel
    .find({ uploadedBy: id })
    .populate({
      path: "uploadedBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("targetBatchIds");

  if (pdf.length === 0) return { success: true, message: "PDFs are not present" };

  return { success: true, message: "PDF's fetched successfully", data: pdf };
};

const getAllPDFByStuentIdService = async (id) => {
  const student = await studentModel.findById(id).populate("assigned_batch");

  if (!student)
    return { success: false, message: "Student is not present for PDF" };

  if (!student.assigned_batch)
    return { success: false, message: "Batch is not present for PDF" };

  const pdf = await pdfModel
    .find({ targetBatchIds: student.assigned_batch })
    .populate({
      path: "uploadedBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("targetBatchIds");

  if (pdf.length === 0) return { success: true, message: "PDFs are not present" };

  return { success: true, message: "PDF's fetched successfully", data: pdf };
};

//POST
const addPDFService = async ({
  title,
  fileType,
  uploadedBy,
  file,
  targetBatchIds,
}) => {
  const trainer = await trainerModel.findById(uploadedBy);
  if (!trainer) return { success: false, message: `Trainer not exist` };

  const batchArray = Array.isArray(targetBatchIds)
    ? targetBatchIds
    : typeof targetBatchIds === "string"
    ? targetBatchIds.split(",")
    : [];

  if (!file || !file.buffer)
    return { success: false, message: `File is missing` };

  const pdf = await fileUtil.uploadFileToCloudinary(
    file.buffer,
    "trainers/pdf",
    "raw",
    file.originalname
  );

  if (!pdf) return { success: false, message: "Failed to upload" };

  const newPDF = await new pdfModel({
    title,
    fileType,
    uploadedBy,
    targetBatchIds: batchArray,
    fileLink: {
      public_id: pdf.public_id,
      secure_id: pdf.secure_url,
    },
  }).save();

  return { success: true, message: `PDF added`, data: newPDF };
};

const updatePDFService = async ({ id, title, targetBatchIds }) => {
  const pdf = await pdfModel.findById(id);

  if (!pdf) return { success: false, message: " PDF is missing" };

  const batches = await batchModel.find({ _id: { $in: targetBatchIds } });

  if (batches.length !== targetBatchIds.length)
    return { success: false, message: "One of the batches is missing" };

  await pdfModel.updateOne(
    { _id: id },
    {
      $set: { title: title },
      $addToSet: { targetBatchIds: { $each: targetBatchIds } },
    }
  );

  return { success: true, message: "PDF updated successfully" };
};

const deletePDFsByIdsService = async (ids) => {
  const pdfs = await pdfModel.find({ _id: { $in: ids } });

  if (pdfs.length !== ids.length)
    return { success: false, message: "One of the pdfs is missing" };

  await pdfModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "PDFs deleted successfully" };
};

export default {
  getAllService,
  getAllPDFByStuentIdService,
  getAllPDFByTrainerIdService,
  addPDFService,
  updatePDFService,
  deletePDFsByIdsService,
};
