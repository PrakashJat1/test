import * as yup from "yup";

//Strong Password
const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

//Files
const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const SUPPORTED_PDF_TYPES = ["application/pdf"];

//login schema
const loginSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(4).required("Password is required"),
});

//Reset password schema
const resetPasswordSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  newPassword: yup
    .string()
    .required("Password required")
    .matches(passwordRules, "Enter a Strong Password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Password must be match"),
});

//Register Schema
const registerSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password required")
    .matches(passwordRules, "Enter a Strong Password"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Password must be match"),
  fullName: yup.string().required().min(3).max(20),
  fatherFullName: yup.string().required(),
  mobileNo: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  DOB: yup
    .date()
    .required("Date of Birth is required")
    .max(new Date(), "DOB cannot be in the future"),

  gender: yup.string().required("Gender is required"),

  localAddress: yup.string().required("Local address is required"),

  permanentAddress: yup.string().required("Permanent address is required"),

  state: yup.string().required("Please select a state"),

  maritalStatus: yup.string().required("Marital status is required"),

  college: yup.string().required("College name is required"),

  qualification: yup.string().required("Qualification is required"),

  graduationCompletionYear: yup
    .number()
    .typeError("Enter a valid year")
    .required("Graduation year is required")
    .min(2000, "Year must be after 2000"),

  familyAnnualIncome: yup
  .number()
  .typeError("Enter a valid amount")
  .required("Family annual income is required")
  .min(10000, "Income must be at least ₹10,000"),


  preferredCity: yup.string().required("Preferred city is required"),

  fromWhereYouFindAboutITEP: yup.string().required("This field is required"),

  photo: yup
    .mixed()
    .required("Photo is required")
    .test(
      "fileSize",
      "Photo must be less than 5MB",
      (value) => value && value[0] && value[0].size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Only JPG, JPEG, or PNG files are allowed",
      (value) =>
        value && value[0] && SUPPORTED_IMAGE_TYPES.includes(value[0].type)
    ),

  documentsPDF: yup
    .mixed()
    .required("Documents PDF is required")
    .test(
      "fileSize",
      "File must be less than 5MB",
      (value) => value && value[0] && value[0].size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Only PDF files are allowed",
      (value) =>
        value && value[0] && SUPPORTED_PDF_TYPES.includes(value[0].type)
    ),

  fatherIncomeCerificate: yup
    .mixed()
    .required("Father's income certificate is required")
    .test(
      "fileSize",
      "File must be less than 5MB",
      (value) => value && value[0] && value[0].size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Only PDF files are allowed",
      (value) =>
        value && value[0] && SUPPORTED_PDF_TYPES.includes(value[0].type)
    ),
});

const verifyOTPSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be a 6-digit number"),
});

//addUserSchema
const addUserSchema = yup.object({
  fullName: yup.string().required().min(3).max(20),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password required")
    .matches(passwordRules, "Enter a Strong Password"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Password must be match"),
  mobileNo: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

//addTrainerSchema
const addTrainerSchema = yup.object({
  fullName: yup.string().required().min(3).max(20),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password required")
    .matches(passwordRules, "Enter a Strong Password"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Password must be match"),
  mobileNo: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  type_Of_Trainer: yup.string().required("Choose trainer type"),
  specialization: yup.string().required(),
});

//Assign Batch to trainer
const assignBatchSchema = yup.object({
  assigned_Batches: yup
    .array()
    .of(yup.string().required())
    .min(1, "Please select at least one batch")
    .required("This field is required"),
});

//Assign Batch to student
const assignBatchtoStudentSchema = yup.object({
  assigned_Batch: yup
    .string()
    .min(1, "Please select at least one batch")
    .required("This field is required"),
});

//Edit/Add Batch Schema
const batchEditSchema = yup.object({
  batch_Name: yup
    .string()
    .required("Batch name is required")
    .min(3, "Batch name must be at least 3 characters"),

  batch_No: yup
    .number()
    .typeError("Batch number must be a number")
    .required("Batch number is required")
    .positive("Batch number must be positive"),

  status: yup
    .string()
    .required("Status is required")
    .oneOf(["upcoming", "ongoing", "completed"], "Invalid status"),

  start_Date: yup
    .date()
    .typeError("Start date is required")
    .required("Start date is required"),

  end_Date: yup
    .date()
    .typeError("End date is required")
    .required("End date is required")
    .min(yup.ref("start_Date"), "End date cannot be earlier than start date"),

  technicalTrainer: yup.string().required("Technical trainer is required"),

  softskillTrainer: yup.string().required(),

  aptitudeTrainer: yup.string().required("Aptitude trainer is required"),
});

//Edit/Add Book Schema
const addBookSchema = yup.object({
  title: yup
    .string()
    .required("Book title is required")
    .min(3, "must be at least 3 characters")
    .max(30),

  author: yup.string().required(),

  isbn: yup.string().required("ISBN is required"),

  category: yup.string().required("category is required"),

  totalQty: yup
    .number()
    .typeError()
    .required()
    .min(0, "Quantity can't be negative"),
});

//Company Edit Schema
const CompanyEditSchema = yup.object({
  name: yup
    .string()
    .typeError()
    .required("Company name is required")
    .min(3, " must be at least 3 characters"),
  roleOffered: yup
    .string()
    .typeError()
    .required("Role offered name is required"),
  packageOffered: yup
    .string()
    .typeError()
    .required("Package Offered name is required"),
  driveDate: yup.date().typeError().required(),
  websiteLink: yup.string().typeError().required(),
  roundsInfo: yup.string().typeError().required(),
  batchIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "Please select at least one batch")
    .required("This field is required"),
});

//edit TimeTable Schema
const editTimeTableSchema = yup.object({
  Name: yup.string().required().min(3),
  batchId: yup.string().required(),
});

//add TimeTable Schema
const addTimeTableSchema = yup.object({
  Name: yup.string().required().min(3),
  batchId: yup.string().required(),
  timetable: yup
    .mixed()
    .required("Time Table is required")
    .test(
      "fileSize",
      "Time Table must be less than 5MB",
      (value) => value && value[0] && value[0].size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Only JPG, JPEG, or PNG files are allowed",
      (value) =>
        value && value[0] && SUPPORTED_IMAGE_TYPES.includes(value[0].type)
    ),
});

//createAssessmentSchema
const createAssessmentSchema = yup.object({
  batchId: yup.string().min(12).required(),
});

//addPDFSchema
const addPDFSchema = yup.object({
  title: yup.string().min(3).required(),
  fileType: yup.string().required(),
  targetBatchIds: yup
    .array()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        return [originalValue];
      }
      return value;
    })
    .min(1, "Please select at least one batch")
    .required("This field is required"),
  pdf: yup
    .mixed()
    .required(" PDF is required")
    .test(
      "fileSize",
      "File must be less than 5MB",
      (value) => value && value[0] && value[0].size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Only PDF files are allowed",
      (value) =>
        value && value[0] && SUPPORTED_PDF_TYPES.includes(value[0].type)
    ),
});

//projectFeedbackSchema
const projectFeedbackSchema = yup.object({
  feedback: yup.string().min(3).required(),
});

//pdfEditSchema
const pdfEditSchema = yup.object({
  title: yup.string().min(3).required(),
  targetBatchIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "Please select at least one batch")
    .required("This field is required"),
});

//addProjectSchema
const addProjectSchema = yup.object({
  title: yup.string().min(3).required(),
  githubLink: yup.string().min(3).required(),
});

//createToastMasterSchema
const selectBatchFormTMSSchema = yup.object({
  batch: yup.string().min(3).required(),
});
const createToastMasterSchema = yup.object({
  theme: yup.string().min(3).required(),
  wordOfDay: yup.string().min(2).required(),
  idiom: yup.string().min(3).required(),
  date: yup.date().required(),
  tmod: yup.string().min(3).required(),
  grammarian: yup.string().min(3).required(),
  ps1: yup.string().min(3).required(),
  ps2: yup.string().min(3).required(),
  generalEvaluator: yup.string().min(3).required(),
  e1: yup.string().min(3).required(),
  e2: yup.string().min(3).required(),
  ttm: yup.string().min(3).required(),
  is1: yup.string().min(3).required(),
  is2: yup.string().min(3).required(),
  is3: yup.string().min(3).required(),
  ac: yup.string().min(3).required(),
  timer: yup.string().min(3).required(),
});

const addSaturdaySessionSchema = yup.object({
  topic: yup.string().min(3).required(),
  ExpertName: yup.string().min(3).required(),
  company: yup.string().min(3).required(),
  position: yup.string().min(3).required(),
  date: yup.date().required(),
  timeFrom: yup.string().min(3).required(),
  timeTo: yup.string().min(3).required(),
  batchIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "Please select at least one batch")
    .required("This field is required"),
});

const placementStatusSchema = yup.object({
  placementStatus: yup.string().required(),
});

const finalSelectionStatusSchema = yup.object({
  status: yup.string().required(),
});

const verifyUserSchema = yup.object({
  password: yup.string().min(1, "Password required"),
});
const editProfileSchema = yup.object({
  fullName: yup.string().required().min(3).max(20),
  email: yup.string().email().required("Email is required"),
  mobileNo: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  password: yup
    .string()
    .required("Password required")
    .matches(passwordRules, "Enter a Strong Password"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Password must be match"),
});

const selectBatchSchema = yup.object({
  batchId: yup.string().required(),
});

export default {
  loginSchema,
  resetPasswordSchema,
  registerSchema,
  verifyOTPSchema,
  addUserSchema,
  addTrainerSchema,
  assignBatchSchema,
  assignBatchtoStudentSchema,
  batchEditSchema,
  CompanyEditSchema,
  addBookSchema,
  editTimeTableSchema,
  addTimeTableSchema,
  createAssessmentSchema,
  addPDFSchema,
  projectFeedbackSchema,
  pdfEditSchema,
  addProjectSchema,
  selectBatchFormTMSSchema,
  createToastMasterSchema,
  addSaturdaySessionSchema,
  placementStatusSchema,
  finalSelectionStatusSchema,
  editProfileSchema,
  verifyUserSchema,
  selectBatchSchema,
};
