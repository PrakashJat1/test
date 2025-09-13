import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "../utils/jwt.util.js";
import otpUtil from "../utils/otp.util.js";
import mailUtil from "../utils/mail.util.js";
import itepApplicants from "../models/itepApplicants.model.js";
import fileUtil from "../utils/file.util.js";
import userModel from "../models/user.model.js";
import trainerModel from "../models/trainer.model.js";
import studentModel from "../models/student.model.js";
import itepApplicantsModel from "../models/itepApplicants.model.js";

const getLoggedInUserService = async (id) => {
  const user = await userModel.findById(id);

  if (!user) return { success: false, message: "user is not present 🥲" };

  return { success: true, message: "User logged In 😊" };
};

const registerService = async ({ fullName, email, password, role, status }) => {
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return {
      success: false,
      message: `User already exist using email ${email}`,
    };
  } else {
    const otp = otpUtil.generateotp();
    const isSend = (await mailUtil.sendotpmail({ fullName, email, otp })).send;

    if (!isSend) {
      return { success: false, message: `Email could not be sent on ${email}` };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
      role,
      status,
      otp,
      otpExpiry: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
      isverified: false,
    });

    await newUser.save();

    return { success: true, message: "Register successfully...!😊" };
  }
};

const registeritepAplicantService = async ({
  fullName,
  email,
  password,
  fatherFullName,
  mobileNo,
  DOB,
  gender,
  localAddress,
  permanentAddress,
  state,
  maritalStatus,
  college,
  qualification,
  graduationCompletionYear,
  familyAnnualIncome,
  preferredCity,
  fromWhereYouFindAboutITEP,
  files,
}) => {
  const existingUser = await userModel.findOne({ email: email });

  const existingApplicant = await itepApplicantsModel.findOne({
    email: email,
  });

  if (existingApplicant || existingUser) {
    return {
      success: false,
      message: `user Already Exist using email ${email}`,
    };
  }

  const otp = otpUtil.generateotp();

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    role: "itep-applicant",
    status: true,
    otp,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 2 minutes from now
    isverified: false,
  });

  const photo = files?.photo?.[0]
    ? await fileUtil.uploadFileToCloudinary(
        files.photo[0].buffer,
        "itepApplicants/photos",
        "auto",
        files.photo[0].originalname
      )
    : false;
  const documentsPDF = files?.documentsPDF?.[0]
    ? await fileUtil.uploadFileToCloudinary(
        files.documentsPDF[0].buffer,
        "itepApplicants/documentsPDF",
        "raw",
        files.documentsPDF[0].originalname
      )
    : false;
  const fatherIncomeCerificate = files?.fatherIncomeCerificate?.[0]
    ? await fileUtil.uploadFileToCloudinary(
        files.fatherIncomeCerificate[0].buffer,
        "itepApplicants/fatherIncomeCerificate",
        "raw",
        files.fatherIncomeCerificate[0].originalname
      )
    : false;

  if (!photo || !documentsPDF || !fatherIncomeCerificate) {
    return {
      success: false,
      message: "Document failed to upload",
    };
  }

  const isSend = (await mailUtil.sendotpmail({ fullName, email, otp })).send;

  if (!isSend) {
    return {
      success: false,
      message: "OTP could not send",
    };
  }

  const createdUser = await newUser.save();

  const itepApplicant = new itepApplicants({
    userId: createdUser._id,
    fullName,
    email,
    password: hashedPassword,
    fatherFullName,
    mobileNo,
    DOB,
    gender,
    localAddress,
    permanentAddress,
    state,
    maritalStatus,
    college,
    qualification,
    graduationCompletionYear,
    familyAnnualIncome,
    preferredCity,
    fromWhereYouFindAboutITEP,
    photo: {
      public_id: photo.public_id,
      secure_url: photo.secure_url,
    },
    documentsPDF: {
      public_id: documentsPDF.public_id,
      secure_url: documentsPDF.secure_url,
    },
    fatherIncomeCerificate: {
      public_id: fatherIncomeCerificate.public_id,
      secure_url: fatherIncomeCerificate.secure_url,
    },
  });

  await itepApplicant.save();

  return {
    success: true,
    message: "OTP send Successfully",
  };
};

const verifyotpService = async ({ email, otp }) => {
  const user = await userModel.findOne({ email: email });

  const isverified = otp === user.otp && user.otpExpiry > Date.now();

  console.log(user, otp);

  if (!isverified) return { success: false, message: "Invalid or expired OTP" };

  user.otp = null;
  user.otpExpiry = null;
  user.isverified = true;
  await user.save();

  return { success: true, message: "Registered successfully😊" };
};

const resendotpService = async ({ fullName, email }) => {
  const existingUser = await userModel.findOne({ email: email });

  if (!existingUser)
    return { success: false, message: `User not exist using email ${email}` };

  const otp = otpUtil.generateotp();
  const isSend = (await mailUtil.sendotpmail({ fullName, email, otp })).send;

  if (!isSend)
    return {
      success: false,
      message: `Email Can't be sent Please check your email ${email}`,
    };

  existingUser.otp = otp;
  (existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)),
    await existingUser.save();
  return { success: true, message: `OTP resend successfully on ${email}` };
};

const forgetPasswordService = async ({ email, newPassword }) => {
  const existingUser = await userModel.findOne({ email });

  console.log(existingUser?.role);
  if (!existingUser)
    return { success: false, message: `User not exist using email ${email}` };

  if (!newPassword)
    return { success: false, message: `newPassword is undefined` };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  existingUser.password = hashedPassword;
  await existingUser.save();

  if (existingUser.role === "itep-applicant") {
    const existingApplicant = await itepApplicantsModel.findOne({ email });

    existingApplicant.password = hashedPassword;
    await existingApplicant.save();
  } else if (existingUser.role === "student") {
    const existingStudent = await studentModel.findOne({ email });
    existingStudent.password = hashedPassword;
    await existingStudent.save();
  }

  return { success: true, message: "Password updated" };
};

const loginService = async ({ email, password }) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, message: "Invalid password" };
  }

  if (!user.isverified) {
    return { success: false, message: "User not verified" };
  }

  let token = null;
  if (user.role == "trainer") {
    const trainer = await trainerModel.findOne({ userId: user._id });
    token = await jwt.jwtTokenGeneration(user._id, trainer.type_Of_Trainer);
  } else {
    token = await jwt.jwtTokenGeneration(user._id, user.role);
  }

  return { success: true, message: "Login Successfully...!😊", token };
};

export default {
  getLoggedInUserService,
  registerService,
  registeritepAplicantService,
  loginService,
  verifyotpService,
  resendotpService,
  forgetPasswordService,
};
