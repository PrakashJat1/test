import { model } from "mongoose";
import assessmentModel from "../models/assessment.model.js";
import batchModel from "../models/batch.model.js";
import studentModel from "../models/student.model.js";
import trainerModel from "../models/trainer.model.js";

//GET

//Charts API
const getBatchAndMonthWiseAssessmentPerformanceForChartService = async () => {
  const assessmentsExist = await assessmentModel.exists({});

  if (!assessmentsExist)
    return {
      success: false,
      message: "Assessment list is empty for chart data",
    };

  const result = await assessmentModel.aggregate([
    // Step 1: Unwind marks array
    { $unwind: "$marks" },

    // Step 2: Lookup student details using marks.studentId
    {
      $lookup: {
        from: "students",
        localField: "marks.studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },

    // Step 3: Group by batch and month to calculate average score
    {
      $group: {
        _id: {
          batch: "$student.assigned_batch",
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        averageScore: { $avg: "$marks.score" },
      },
    },

    // Step 4: Lookup batch name
    {
      $lookup: {
        from: "batches",
        localField: "_id.batch",
        foreignField: "_id",
        as: "batch",
      },
    },
    { $unwind: "$batch" },

    // Step 5: Final projection
    {
      $project: {
        _id: 0,
        batchName: "$batch.batch_Name",
        month: "$_id.month",
        year: "$_id.year",
        averageScore: 1,
      },
    },

    // Step 6: Sort by batchName and month
    { $sort: { batchName: 1, month: 1 } },
  ]);

  return {
    success: true,
    message: "Chart data generated",
    data: result,
  };
};

const getAllService = async (id) => {
  const assessment = await assessmentModel
    .find()
    .populate("batchId")
    .populate({
      path: "createdBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "marks.studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (assessment.length === 0)
    return { success: true, message: "Assessement listis empty" };

  return {
    success: true,
    message: "Assessement fetched successfully",
    data: assessment,
  };
};

const getAllByIdService = async (id) => {
  const assessment = await assessmentModel
    .findById(id)
    .populate("batchId")
    .populate({
      path: "createdBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "marks.studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (!assessment)
    return { success: false, message: "Assessement is not present" };

  return {
    success: true,
    message: "Assessement fetched successfully",
    data: assessment,
  };
};

const getAllByTrainerIdService = async (id) => {
  const assessment = await assessmentModel
    .find({ createdBy: id })
    .populate("batchId")
    .populate({
      path: "createdBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "marks.studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (assessment.length === 0)
    return { success: true, message: "Assessement is not present" };

  return {
    success: true,
    message: "Assessement fetched successfully",
    data: assessment,
  };
};

const getAllByBatchIdService = async (id) => {
  const assessment = await assessmentModel
    .find({ batchId : id })
    .populate("batchId")
    .populate({
      path: "createdBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "marks.studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (assessment.length === 0)
    return { success: true, message: "Assessement is not present" };

  return {
    success: true,
    message: "Assessement fetched successfully",
    data: assessment,
  };
};

const getMarksByAssessmentIdService = async (id) => {
  const assessment = await assessmentModel.findById(id);

  if (!assessment)
    return { success: false, message: "Assessement is not present" };

  if (assessment.marks.length === 0)
    return { success: true, message: "Assessment Marks list is empty" };

  return {
    success: true,
    message: "Assessement marks gotted successfully",
    data: assessment.marks,
  };
};

const getAssessementMarksByStudentIdService = async (id) => {
  const assessments = await assessmentModel.find();

  if (assessments.length === 0)
    return { success: true, message: "Assessement is not present" };

  const studentMarks = [];

  for (const assessment of assessments) {
    for (const mark of assessment.marks) {
      if (mark.studentId.equals(id)) {
        studentMarks.push({
          assessmentId: assessment._id,
          title: assessment.title,
          type: assessment.type,
          month: assessment.month,
          score: mark.score,
          feedback: mark.feedback,
        });
      }
    }
  }

  return { success: true, message: "Marks gotted", data: studentMarks };
};

const getAllAssessmentsByStudentIdService = async (id) => {
  const assessment = await assessmentModel
    .find({ "marks.studentId": id })
    .populate("batchId")
    .populate({
      path: "createdBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "marks.studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (assessment.length === 0)
    return {
      success: true,
      message: "Assessment is not present by student Id",
    };

  return {
    success: true,
    message: "Assessement fetched successfully",
    data: assessment,
  };
};

//POST
const createAssessmentService = async ({
  title,
  batchId,
  createdBy,
  month,
}) => {
  const exitingAssessmentByMonth = await assessmentModel.findOne({
    month,
    createdBy,
    batchId,
  });

  if (exitingAssessmentByMonth) {
    return {
      success: false,
      message: `Only one Assessment per month is allowed`,
    };
  }

  const batch = await batchModel.findById(batchId);
  if (!batch)
    return { success: false, message: `Batch is not exit for assessment` };

  const trainer = await trainerModel.findById(createdBy);
  if (!trainer)
    return { success: false, message: `Trainer is not exit for assessment` };

  const isBatchAssignedToTrainer = trainer.assigned_Batches.some((batch1) =>
    batch1.equals(batchId)
  );
  if (!isBatchAssignedToTrainer)
    return {
      success: false,
      message: `${batch.batch_Name} is not assigned to You`,
    };

  const isStudentsPresentInBatch = batch.students.length > 0;

  if (!isStudentsPresentInBatch)
    return {
      success: false,
      message: `${batch.batch_Name} has No students to take assessment`,
    };

  const students = await studentModel
    .find({ assigned_batch: batchId })
    .select("_id");

  const marks = students.map((student) => ({
    studentId: student._id,
    score: 0,
    feedback: "",
  }));

  const newAssessment = await new assessmentModel({
    title,
    type: trainer.type_Of_Trainer,
    batchId,
    createdBy,
    month,
    marks,
  }).save();

  const assessmentData = await assessmentModel
    .findById(newAssessment._id)
    .populate("batchId")
    .populate({
      path: "createdBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "marks.studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  return {
    success: true,
    message: `Assessment is created for Batch ${batch.batch_Name}`,
    assessment: assessmentData,
  };
};

//PUT
const updateAssessmentMarksService = async ({ assessmentId, marks }) => {
  const assessment = await assessmentModel.findById(assessmentId);

  if (!assessment) return { success: false, message: `Assessment is not exit` };

  //update or add new marks
  marks.forEach((newMark) => {
    const existingIndex = assessment.marks.findIndex(
      (mark) => mark.studentId.toString() === newMark.studentId
    );

    if (existingIndex !== -1) {
      // Update existing mark
      assessment.marks[existingIndex].score = newMark.score;
      assessment.marks[existingIndex].feedback = newMark.feedback;
    } else {
      // Add new mark
      assessment.marks.push(newMark);
    }
  });

  const newAssessment = await assessment.save();

  const assessmentData = await assessmentModel
    .findById(newAssessment._id)
    .populate("batchId")
    .populate({
      path: "createdBy",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "marks.studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  return {
    success: true,
    message: `marks updated successfully of ${assessment.title}`,
    assessment: assessmentData,
  };
};

//DELETE
const deleteAssessementService = async (ids) => {
  const assessment = await assessmentModel.find({ _id: { $in: ids } });

  if (assessment.length !== ids.length)
    return { success: false, message: "One of the Assessments is not exist" };

  await assessmentModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "Assessements deleted" };
};
export default {
  getBatchAndMonthWiseAssessmentPerformanceForChartService,
  getAllService,
  getAllByTrainerIdService,
  getAllByBatchIdService,
  getAllByIdService,
  getAllAssessmentsByStudentIdService,
  getMarksByAssessmentIdService,
  getAssessementMarksByStudentIdService,
  createAssessmentService,
  updateAssessmentMarksService,
  deleteAssessementService,
};
