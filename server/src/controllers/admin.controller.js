import { request, response } from "express";
import adminService from "../services/admin.service.js";
import { InternalServerError } from "../utils/error.util.js";

const createAdminAccount = async () => {
  await adminService.createAdminService();
};

export default {
  createAdminAccount
};
