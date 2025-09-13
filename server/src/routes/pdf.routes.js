import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import pdfController from "../controllers/pdf.controller.js";
import upload from "../middlewares/multer.middleware.js";

const pdfRoute = express.Router();

pdfRoute.use(verifyToken);

//GET

pdfRoute.get(
  "/getAll",
  authorizeRoles("management", "admin"),
  pdfController.getAll
);

pdfRoute.get(
  "/getAllPDFByTrainerId/:id",
  authorizeRoles("technical", "softskill", "aptitude", "management", "admin"),
  pdfController.getAllPDFByTrainerId
);

pdfRoute.get(
  "/getAllPDFByStudentId/:id",
  authorizeRoles("trainer", "management", "admin", "student"),
  pdfController.getAllPDFByStuentId
);

//POST
pdfRoute.post(
  "/addPDF/:trainerId",
  authorizeRoles(
    "technical",
    "softskill",
    "aptitude",
    "management",
    "admin",
    "hr"
  ),
  upload.single("pdf"),
  pdfController.addPDF
);

//PUT
pdfRoute.put(
  "/updatePDF",
  authorizeRoles("admin", "management", "technical", "softskill", "aptitude"),
  pdfController.updatePDF
);

//DELETE
pdfRoute.delete(
  "/deletePDFsByIds",
  authorizeRoles("admin"),
  pdfController.deletePDFsByIds
);

export default pdfRoute;
