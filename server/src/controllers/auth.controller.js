import authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import user from "../models/user.model.js";
import itepApplicants from "../models/itepApplicants.model.js";
import { InternalServerError } from "../utils/error.util.js";
import { request, response } from "express";

const getLoggedInUser = async (request, response) => {
  try {
    const id = request.user.userId;
    const result = await authService.getLoggedInUserService(id);

    result.success
      ? response.status(200).json(result.message)
      : response.status(401).json(result.message);
  } catch (error) {
    InternalServerError(response, "getLoggedInUser", error);
  }
};

const register = async (request, response) => {
  try {
    const { fullName, email, password, role, status } = request.body;

    const payLoad = {
      fullName,
      email,
      password,
      role,
      status,
    };

    const result = await authService.registerService(payLoad);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "register", error);
  }
};

const registeritepAplicant = async (request, response) => {
  const {
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
  } = request.body;

  const files = request.files;

  const payLoad = {
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
  };

  try {
    const result = await authService.registeritepAplicantService(payLoad);

    result.success
      ? response.status(201).json(result)
      : response.status(404).json(result);
  } catch (error) {
    InternalServerError(response, "registeritepAplicant", error);
  }
};

const verifyotp = async (request, response) => {
  try {
    const { email, otp } = request.body;

    const payLoad = {
      email,
      otp,
    };
    const result = await authService.verifyotpService(payLoad);

    result.success
      ? response.status(201).json(result)
      : response.status(404).json(result);
  } catch (error) {
    InternalServerError(response, "verifyotp", error);
  }
};

const resendotp = async (request, response) => {
  try {
    const { fullName, email } = request.body;

    const payLoad = {
      fullName,
      email,
    };
    const result = await authService.resendotpService(payLoad);

    result.success
      ? response.status(201).json(result)
      : response.status(404).json(result);
  } catch (error) {
    InternalServerError(response, "resendotp", error);
  }
};

const forgetPassword = async (request, response) => {
  try {
    const { email, newPassword } = request.body;

    const payLoad = {
      email,
      newPassword,
    };

    const result = await authService.forgetPasswordService(payLoad);

    result.success
      ? response.status(201).json(result)
      : response.status(404).json(result);
  } catch (error) {
    InternalServerError(response, "forgetPassword", error);
  }
};

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const payLoad = {
      email,
      password,
    };
    const result = await authService.loginService(payLoad);

    result.success
      ? response.status(201).json(result)
      : response.status(401).json(result.message);
  } catch (error) {
    InternalServerError(response, "login", error);
  }
};

export default {
  getLoggedInUser,
  register,
  registeritepAplicant,
  login,
  verifyotp,
  resendotp,
  forgetPassword,
};
