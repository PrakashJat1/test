import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import batchModel from "../models/batch.model.js";
import studentModel from "../models/student.model.js";
import { enrollmentIdGenerator } from "../utils/enrollmentgenerator.util.js";

//GET
const getAllService = async () => {
  const students1 = await studentModel
    .find()
    .populate("userId")
    .populate("assigned_batch");

  if (students1.length === 0)
    return { success: true, message: "Student list is empty" };

  return { success: true, message: "Successful", students: students1 };
};

const getStudentByUserIdService = async (id) => {
  const student = await studentModel
    .find({ userId: id })
    .populate("userId")
    .populate("assigned_batch");

  if (!student) return { succcess: false, message: "Student is not present" };

  return { success: true, message: "Successful", data: student[0] };
};

//POST
const addStudentService = async ({
  fullName,
  email,
  password,
  assigned_batch,
  college,
  qualification,
}) => {
  const exitingUser = await userModel.findOne({ email });
  const exitingStudent = await studentModel.findOne({ email });

  if (exitingUser || exitingStudent) {
    return {
      success: false,
      message: `Student already present using email 
      ${email}`,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const batch = await batchModel.findById(assigned_batch);

  if (!batch) {
    return {
      success: false,
      message: `Assigned Batch is not exist`,
    };
  }

  const newUser = await new userModel({
    fullName,
    email,
    password: hashedPassword,
    role: "student",
    isverified: true,
  }).save();

  const countOfPresentStudent = await studentModel.countDocuments({
    assigned_batch,
  });

  const enrollmentId = enrollmentIdGenerator(
    batch.start_Date,
    batch.batch_No,
    countOfPresentStudent
  );

  await new studentModel({
    userId: newUser._id,
    enrollmentId,
    assigned_batch,
    college,
    qualification,
    status: true,
  }).save();

  return { success: true, message: `Student created using email${email}` };
};

//PUT
const assignBatchService = async ({ studentsIds, batchId }) => {
  const students = await studentModel.find({ _id: { $in: studentsIds } });
  if (students.length !== studentsIds.length)
    return { success: false, message: "Any of the student is not present" };

  const batch = await batchModel.findById(batchId);
  if (!batch) return { success: false, message: "Batch is not present" };

  const previousBatchIds = [
    ...new Set(students.map((s) => s.assigned_batch).filter(Boolean)),
  ];

  await Promise.all(
    previousBatchIds.map(async (prevBatchId) => {
      await batchModel.findByIdAndUpdate(prevBatchId, {
        $pull: { students: { $in: studentsIds } },
      });
    })
  );

  await studentModel.updateMany(
    { _id: { $in: studentsIds } },
    { $set: { assigned_batch: batchId } }
  );

  await batchModel.findByIdAndUpdate(batchId, {
    $addToSet: { students: { $each: studentsIds } },
  });

  return { success: true, message: "Batch reassignment successful" };
};

const updateStudentsPlacementStatusService = async ({
  studentsIds,
  placementStatus,
}) => {
  const student = await studentModel.find({ _id: { $in: studentsIds } });

  if (student.length !== studentsIds.length)
    return { success: false, message: "One of the students not present" };

  await studentModel.updateMany(
    { _id: { $in: studentsIds } },
    {
      $set: { placementStatus: placementStatus },
    }
  );

  return { success: true, message: "Placement Status updated" };
};

//DELETE
//delete the student
const deleteStudentService = async (id) => {
  const student = await studentModel.findById(id);

  if (!student) return { success: false, message: "Student is not present" };

  // Batch, Assessment, Project, Application, BookIssue, ToastmastersSession

  await batchModel.updateOne(
    { _id: student.assigned_batch },
    { $pull: { students: id } }
  );

  await assessmentModel.updateMany({}, { $pull: { marks: { studentId: id } } });

  await toastmasterModel.updateMany({}, { $pull: { roles: { student: id } } });

  await studentModel.deleteOne({ _id: id });

  return { success: true, message: "Student deleted" };
};

export default {
  getAllService,
  getStudentByUserIdService,
  addStudentService,
  assignBatchService,
  updateStudentsPlacementStatusService,
  deleteStudentService,
};
