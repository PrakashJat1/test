import express from "express";
import assessmentController from "../controllers/assessment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const assessmentRoute = express.Router();

//Global Middleware
assessmentRoute.use(verifyToken);

//GET
//Admin Chart
assessmentRoute.get(
  "/getBatchAndMonthWiseAssessmentPerformanceForChart",
  authorizeRoles("admin", "management"),
  assessmentController.getBatchAndMonthWiseAssessmentPerformanceForChart
);

assessmentRoute.get(
  "/getAll",
  authorizeRoles("admin", "management", "technical", "softskill", "aptitude",'hr'),
  assessmentController.getAll
);

assessmentRoute.get(
  "/getAllByTrainerId/:id",
  authorizeRoles("technical", "softskill", "aptitude"),
  assessmentController.getAllByTrainerId
);

assessmentRoute.get(
  "/getAllByBatchId/:id",
  authorizeRoles("student"),
  assessmentController.getAllByBatchId
);

assessmentRoute.get(
  "/getAllById/:id",
  authorizeRoles("admin", "management", "trainer"),
  assessmentController.getAllById
);

assessmentRoute.get(
  "/getMarksByAssessmentId/:id",
  authorizeRoles("admin", "management", "trainer"),
  assessmentController.getMarksByAssessmentId
);

assessmentRoute.get(
  "/getAssessementMarksByStudentId/:id",
  authorizeRoles("admin", "management", "trainer", "student"),
  assessmentController.getAssessementMarksByStudentId
);

assessmentRoute.get(
  "/getAllAssessmentsByStudentId/:id",
  authorizeRoles("admin", "management", "student", "trainer"),
  assessmentController.getAllAssessmentsByStudentId
);

//POST API's
assessmentRoute.post(
  "/createAssessment/:createdBy/:batchId",
  authorizeRoles("technical", "softskill", "aptitude"),
  assessmentController.createAssessment
);

//PUT API's
assessmentRoute.put(
  "/updateAssessmentMarks/:assessmentId",
  authorizeRoles("technical", "softskill", "aptitude"),
  assessmentController.updateAssessmentMarks
);

//DELETE
// assessmentRoute.delete('/deleteAssessment/:id',authorizeRoles('admin','trainer'),assessmentController.deleteAssessment);

assessmentRoute.delete(
  "/deleteAssessments",
  authorizeRoles("admin"),
  assessmentController.deleteAssesments
);

export default assessmentRoute;
