import express from "express";
import authController from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.get('/loggedInUser',verifyToken,authController.getLoggedInUser);

authRouter.post("/register", authController.register);

authRouter.post(
  "/registeritepapplicant",
  upload.fields(
    //It attach the files to request body
    [
      { name: "photo", maxCount: 1 },
      { name: "documentsPDF", maxCount: 1 },
      { name: "fatherIncomeCerificate", maxCount: 1 },
    ]
  ),
  authController.registeritepAplicant
);

authRouter.post("/verify-otp", authController.verifyotp);

authRouter.post("/resend-otp", authController.resendotp);

authRouter.post("/forget-password", authController.forgetPassword);

authRouter.post("/login", authController.login);

export default authRouter;
