import batchModel from "../models/batch.model.js";
import itepApplicantsModel from "../models/itepApplicants.model.js";
import studentModel from "../models/student.model.js";
import userModel from "../models/user.model.js";
import { enrollmentIdGenerator } from "../utils/enrollmentgenerator.util.js";
import fileUtil from "../utils/file.util.js";
import mailUtil from "../utils/mail.util.js";

//GET
const getAllService = async () => {
  const applicants = await itepApplicantsModel.find().populate("userId");

  if (applicants.length === 0)
    return { success: true, message: "itep applicants list empty" };

  return { success: true, message: "successfull", data: applicants };
};

const getCurrentMonthRegisteredApplicantsService = async () => {
  const currentDate = new Date();
  const applicants = await itepApplicantsModel.find().populate("userId");

  if (applicants.length === 0)
    return { success: true, message: "itep applicants list empty" };

  const currentMonthApplicants = applicants.filter((applicant) => {
    const appliedOn = new Date(applicant.appliedOn);
    return (
      appliedOn.getMonth() === currentDate.getMonth() &&
      appliedOn.getFullYear() === currentDate.getFullYear()
    );
  });

  if (currentMonthApplicants.length === 0)
    return {
      success: false,
      message: "current month itep applicants list empty",
    };

  return { success: true, message: "Success", data: currentMonthApplicants };
};

//PUT
const updateApplicantsStatusForExamService = async ({
  examAllowed,
  ids,
  reason,
}) => {
  const applicants = await itepApplicantsModel.find({ _id: { $in: ids } });

  if (applicants.length !== ids.length) {
    return { success: false, message: "One or more applicants not found" };
  }

  await itepApplicantsModel.updateMany(
    { _id: { $in: ids } },
    { $set: { examAllowed: examAllowed, rejectionReason: reason } }
  );

  return { success: true, message: "Status updated successfully" };
};

const updateApplicantsStatusForSelectionService = async ({
  status,
  ids,
  batchId,
}) => {
  const statusArray = ["pending", "selected", "rejected"];

  if (!statusArray.includes(status))
    return { success: false, message: "Invalid Status" };

  const applicants = await itepApplicantsModel.find({ _id: { $in: ids } });

  if (applicants.length !== ids.length) {
    return { success: false, message: "One or more applicants not found" };
  }

  const applicantsUserIds = applicants.map((applicant) => applicant.userId);

  const users = await userModel.find({ _id: { $in: applicantsUserIds } });

  const usersIds = users.map((user) => user._id);

  if (status === "selected") {
    const batch = await batchModel.findById(batchId);

    if (!batch) {
      return {
        success: false,
        message: `Assigned Batch is not exist`,
      };
    }

    await userModel.updateMany(
      { _id: { $in: usersIds } },
      {
        $set: {
          role: "student",
        },
      }
    );

    const countOfPresentStudent = await studentModel.countDocuments({
      assigned_batch: batchId,
    });

    for (let i = 0; i < applicants.length; i++) {
      const applicant = applicants[i];
      const enrollmentId = enrollmentIdGenerator(
        batch.start_Date,
        batch.batch_No,
        countOfPresentStudent + i
      );

      await new studentModel({
        userId: applicant.userId,
        enrollmentId: enrollmentId,
        assigned_batch: batchId,
        fatherFullName: applicant.fatherFullName,
        DOB: applicant.DOB,
        gender: applicant.gender,
        maritalStatus: applicant.maritalStatus,
        localAddress: applicant.localAddress,
        permanentAddress: applicant.permanentAddress,
        state: applicant.state,
        college: applicant.college,
        qualification: applicant.qualification,
        graduationCompletionYear: applicant.graduationCompletionYear,
        familyAnnualIncome: applicant.familyAnnualIncome,
        preferredCity: applicant.preferredCity,
      }).save();
    }

    for (const user of users) {
      const isSend = await mailUtil.sendFinalSelectionMail(
        user.fullName,
        user.email,
        batch
      );
    }

    await itepApplicantsModel.deleteMany({ _id: { $in: ids } });
    return { success: true, message: "All Applicants Converted to students" };
  } else
    await itepApplicantsModel.updateMany(
      { _id: { $in: ids } },
      { $set: { status: status } }
    );

  return { success: true, message: `All Applicants ${status}` };
};

//DELETE
const deleteApplicantsService = async (ids) => {
  const applicants = await itepApplicantsModel.find({ _id: { $in: ids } });

  console.log(ids);

  if (applicants.length !== ids.length) {
    return { success: false, message: "One or more applicants not found" };
  }

  await itepApplicantsModel.deleteMany({ _id: { $in: ids } });

  //delete documents
  applicants.forEach(async (applicant) => {
    await fileUtil.deleteCloudinaryFile(applicant.photo.public_id);
    await fileUtil.deleteCloudinaryFile(applicant.documentsPDF.public_id);
    await fileUtil.deleteCloudinaryFile(
      applicant.fatherIncomeCerificate.public_id
    );
  });

  return { success: true, message: "Applicants deleted" };
};

const deleteApplicantService = async (id) => {
  const applicant = await itepApplicantsModel.findById(id);

  if (!applicant) {
    return { success: false, message: "applicant not found" };
  }

  await itepApplicantsModel.deleteOne({ _id: id });

  //delete documents
  await fileUtil.deleteCloudinaryFile(applicant.photo.public_id);
  await fileUtil.deleteCloudinaryFile(applicant.documentsPDF.public_id);
  await fileUtil.deleteCloudinaryFile(
    applicant.fatherIncomeCerificate.public_id
  );

  return { success: true, message: "Applicant deleted" };
};

export default {
  getAllService,
  getCurrentMonthRegisteredApplicantsService,
  updateApplicantsStatusForExamService,
  updateApplicantsStatusForSelectionService,
  deleteApplicantService,
  deleteApplicantsService,
};
