import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnection.config.js";
import authRoute from "./routes/auth.routes.js";
import adminController from "./controllers/admin.controller.js";
import trainerRoute from "./routes/trainer.routes.js";
import itepApplicantRoute from "./routes/itepapplicant.routes.js";
import projectRoute from "./routes/project.routes.js";
import bookissueRoute from "./routes/bookissue.routes.js";
import assessmentRoute from "./routes/assessment.routes.js";
import batchRoute from "./routes/batch.routes.js";
import studentRoute from "./routes/student.routes.js";
import bookRoute from "./routes/book.routes.js";
import pdfRoute from "./routes/pdf.routes.js";
import timetableRoute from "./routes/timetable.routes.js";
import companyRoute from "./routes/company.routes.js";
import saturdaySessionRoute from "./routes/saturdaySession.routes.js";
import toastmasterRoute from "./routes/toastmaster.routes.js";
import userRoute from "./routes/user.routes.js";

dotenv.config(); //now we can easily access the .env variables

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.originalUrl}`);
//   next();
// });

const PORT = process.env.PORT || 7000;

//database connection
dbConnect();

//admin creation
adminController.createAdminAccount();

//Routes
app.use("/api/auth", authRoute);
app.use("/api/assessment", assessmentRoute);
app.use("/api/book-issue", bookissueRoute);
app.use("/api/book", bookRoute);
app.use("/api/batch", batchRoute);
app.use("/api/company", companyRoute);
app.use("/api/itep-applicant", itepApplicantRoute);
app.use("/api/trainer", trainerRoute);
app.use("/api/timetable", timetableRoute);
app.use("/api/project", projectRoute);
app.use("/api/pdf", pdfRoute);
app.use("/api/student", studentRoute);
app.use("/api/saturdaysession", saturdaySessionRoute);
app.use("/api/toast-master", toastmasterRoute);
app.use("/api/user", userRoute);

app.listen(PORT, () => console.log(`server listen at ${PORT} `));
