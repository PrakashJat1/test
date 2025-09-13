import express from "express";
import projectController from "../controllers/project.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const projectRoute = express.Router();

//Global middlewares
projectRoute.use(verifyToken);

//GET
projectRoute.get(
  "/getAllProjects",
  authorizeRoles("admin", "management", "hr"),
  projectController.getAllProjects
);

projectRoute.get(
  "/getProjectById/:id",
  authorizeRoles("admin", "management", "trainer", "student", "hr"),
  projectController.getProjectById
);

projectRoute.get(
  "/getAllProjectsByStudentId/:id",
  authorizeRoles(
    "admin",
    "management",
    "trainer",
    "student",
    "labassistant",
    "hr"
  ),
  projectController.getAllProjectsByStudentId
);

//POST API's
projectRoute.post(
  "/addProject/:studentId",
  authorizeRoles("student"),
  projectController.addProject
);

projectRoute.post(
  "/getAllProjectsByBatchIds",
  authorizeRoles(
    "admin",
    "management",
    "technical",
    "student",
    "labassistant",
    "hr"
  ),
  projectController.getAllProjectsByBatchIds
);

//PUT
projectRoute.put(
  "/updateFeedbackById/:id",
  authorizeRoles("technical", "labassistant"),
  projectController.updateFeedbackById
);

//DELETE
projectRoute.delete(
  "/deleteProjectsByIds",
  authorizeRoles("admin"),
  projectController.deleteProjectsByIds
);

export default projectRoute;
