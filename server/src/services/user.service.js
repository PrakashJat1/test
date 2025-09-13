import userModel from "../models/user.model.js";
import bcrpt from "bcryptjs";
import itepapplicantService from "./itepapplicant.service.js";
import studentModel from "../models/student.model.js";
import trainerModel from "../models/trainer.model.js";

//GET
const getAllUsersService = async (id) => {
  const users = await userModel.find();
  if (users.length === 0) return { success: true, message: "User list is empty" };

  return { success: true, message: `User fetched successfully 😊`, users };
};

const getByIdService = async (id) => {
  const user = await userModel.findById(id);
  if (!user) return { success: false, message: "User not found" };

  return { success: true, message: `User fetched successfully 😊`, user };
};

//POST
const addUserService = async ({
  fullName,
  email,
  password,
  mobileNo,
  role,
}) => {
  const existingUser = await userModel.findOne({ email });

  if (existingUser)
    return {
      success: false,
      message: `User already exist using email ${email}`,
    };

  const hashedPassword = await bcrpt.hash(password, 10);

  await new userModel({
    fullName,
    email,
    password: hashedPassword,
    mobileNo,
    role,
    status: true,
    isverified: true,
  }).save();

  return { success: true, message: `${fullName} created ` };
};

const verifyUserService = async ({ id, password }) => {
  const user = await userModel.findById(id);
  if (!user) return { success: false, message: "User not found" };

  const isCorrectPassword = await bcrpt.compare(password, user.password);

  if (!isCorrectPassword) return { success: false, message: "Wrong Password" };

  return { success: true, message: `User fetched successfully 😊`, user };
};

//PUT
const updateUserStatusService = async (ids, status) => {
  const users = await userModel.find({ _id: { $in: ids } });

  if (users.length !== ids.length)
    return { success: false, message: "One of the users is not present" };

  for (const id of ids) {
    const user = await userModel.findById(id);
    if (user) {
      await userModel.updateOne({ _id: id }, { $set: { status: status } });
    }
  }

  return { success: true, message: "Users status updated" };
};

const updateUserProfileByIdService = async ({
  id,
  fullName,
  email,
  password,
  mobileNo,
}) => {
  const user = await userModel.findById(id);

  if (!user) return { success: false, message: "User is not present" };

  const existingUserWithEmail = await userModel.findOne({
    email,
    _id: { $ne: user._id },
  });

  if (existingUserWithEmail)
    return {
      success: false,
      message: `User is already present using ${email}`,
    };

  const hashedPassword = await bcrpt.hash(password, 10);

  await userModel.updateOne(
    { _id: id },
    {
      $set: {
        fullName,
        email,
        password: hashedPassword,
        mobileNo,
      },
    }
  );

  return { success: true, message: "Profile updated successfully" };
};

//DELETE
const deleteUserService = async (ids) => {
  const users = await userModel
    .find({ _id: { $in: ids } })
    .populate("studentProfile")
    .populate("trainerProfile")
    .populate("itepApplicantProfile");

  if (users.length !== ids.length)
    return { success: false, message: "One of the users is not present" };

  for (const user of users) {
    switch (user.role) {
      case "student":
        await studentModel.deleteOne({ userId: user._id });

        break;
      case "trainer":
        await trainerModel.deleteOne({ userId: user._id });

        break;

      case "itep-applicant":
        await itepapplicantService.deleteApplicantService({ userId: user._id });

        break;

      default:
        break;
    }
  }

  await userModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "User deleted successfully" };
};

export default {
  getAllUsersService,
  getByIdService,
  addUserService,
  verifyUserService,
  updateUserStatusService,
  updateUserProfileByIdService,
  deleteUserService,
};
