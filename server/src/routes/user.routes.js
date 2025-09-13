import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import userController from "../controllers/user.controller.js";

const userRoute = express.Router();

//global middleware
userRoute.use(verifyToken);

//GET
userRoute.get("/getAllUsers", userController.getAllUsers);

userRoute.get("/getById/:id", userController.getById);

//POST
userRoute.post("/createUser", authorizeRoles("admin"), userController.addUser);

userRoute.post(
  "/verifyUser",
  authorizeRoles(
    "admin",
    "itep-applicant",
    "student",
    "technical",
    "softskill",
    "aptitude",
    "hr",
    "management"
  ),
  userController.verifyUser
);

//PUT
userRoute.put(
  "/updateUserStatus",
  authorizeRoles("admin"),
  userController.updateUserStatus
);

userRoute.put(
  "/updateUserProfileById/:id",
  authorizeRoles(
    "admin",
    "itep-applicant",
    "student",
    "technical",
    "softskill",
    "aptitude",
    "hr",
    "management"
  ),
  userController.updateUserProfileById
);

//DELETE
userRoute.delete(
  "/deleteUser",
  authorizeRoles("admin"),
  userController.deleteUser
);

export default userRoute;
