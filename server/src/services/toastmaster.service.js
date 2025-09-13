import { model } from "mongoose";
import toastmasterModel from "../models/toastmaster.model.js";
import userModel from "../models/user.model.js";

//GET
const getAllService = async () => {
  const toastmaster = await toastmasterModel
    .find()
    .populate("hostedBy")
    .populate("batch")
    .populate({
      path: "roles.student",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (toastmaster.length === 0) return { success: true, message: "toastmaster not exist" };

  return {
    success: true,
    message: "Toastmasters fetched successfully",
    data: toastmaster,
  };
};

const getAllSessionsByBatchIdService = async (id) => {
  const toastmaster = await toastmasterModel
    .find({ batch: id })
    .populate("hostedBy")
    .populate("batch")
    .populate({
      path: "roles.student",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (toastmaster.length === 0)
    return { success: true, message: "toastmaster not exist" };

  return {
    success: true,
    message: "Toastmasters fetched successfully",
    data: toastmaster,
  };
};

const getByIdService = async (id) => {
  const toastmaster = await toastmasterModel
    .findById(id)
    .populate("hostedBy")
    .populate("batch")
    .populate({
      path: "roles.student",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (!toastmaster) return { success: false, message: "toastmaster not exist" };

  return {
    success: true,
    message: "Toastmaster fetched successfully",
    data: toastmaster,
  };
};

//POST
const createToastMasterService = async ({
  hostedBy,
  batch,
  date,
  theme,
  wordOfDay,
  idiom,
  roles,
}) => {
  const user = await userModel.findById(hostedBy);

  if (!user) return { success: false, message: `User not present` };

  const exitingSession = await toastmasterModel.findOne({ batch, date });

  if (exitingSession)
    return {
      success: false,
      message: `Session already created on ${date} for ${batch}`,
    };

  await new toastmasterModel({
    date,
    theme,
    wordOfDay,
    idiom,
    hostedBy,
    batch,
    roles,
  }).save();

  return { success: true, message: "Session created" };
};

//PUT
const updateToastmasterRolesService = async ({ id, roles }) => {
  const existingToastMaster = await toastmasterModel.findById(id);

  if (!existingToastMaster)
    return { success: false, message: "Session is not exist" };

  existingToastMaster.roles = roles;

  await existingToastMaster.save();

  return { success: true, message: "Roles updated" };
};

const editToasterMasterByIdService = async ({
  id,
  hostedBy,
  batch,
  date,
  theme,
  wordOfDay,
  idiom,
  roles,
}) => {
  const user = await userModel.findById(hostedBy);

  if (!user) return { success: false, message: `User not present` };

  const exitingSession = await toastmasterModel.findById(id);

  if (!exitingSession)
    return {
      success: false,
      message: `Session ais not present`,
    };

  await toastmasterModel.updateOne(
    { _id: id },
    {
      date,
      theme,
      wordOfDay,
      idiom,
      hostedBy,
      batch,
      roles,
    }
  );

  return { success: true, message: "Session Updated" };
};

//DELETE
const deleteByIdService = async (id) => {
  const toastmaster = await toastmasterModel.findByIdAndDelete(id);

  if (!toastmaster)
    return { success: false, message: "Toastmaster is not present " };

  return { success: true, message: "Toastmaster Deleted", data: toastmaster };
};

const deleteToastmasterSessionsService = async (ids) => {
  const toastmasters = await toastmasterModel.find({ _id: { $in: ids } });

  if (toastmasters.length !== ids.length)
    return {
      success: false,
      message: "Any of the Toastmaster Session is not present ",
    };

  await toastmasterModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "Toastmaster Sessions Deleted" };
};

export default {
  getAllService,
  getByIdService,
  getAllSessionsByBatchIdService,
  createToastMasterService,
  updateToastmasterRolesService,
  editToasterMasterByIdService,
  deleteByIdService,
  deleteToastmasterSessionsService,
};
