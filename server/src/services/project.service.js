import { model } from "mongoose";
import batchModel from "../models/batch.model.js";
import projectModel from "../models/project.model.js";
import studentModel from "../models/student.model.js";

//GET

const getAllProjectsService = async () => {
  const projects = await projectModel
    .find()
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("batchId");

  if (projects.length === 0)
    return { success: true, message: "Projects is not Present" };

  return {
    success: true,
    message: "Project successfully fetched",
    data: projects,
  };
};

const getProjectByIdService = async (id) => {
  const project = await projectModel
    .findById(id)
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("batchId");

  if (!project) return { success: false, message: "Project is not present" };

  return {
    success: true,
    message: "Project successfully fetched",
    data: project,
  };
};

const getAllProjectsByStudentIdService = async (id) => {
  const project = await projectModel.find({ studentId: id }).populate({
    path: "batchId",
    populate: {
      path: "technicalTrainer",
      model: "Trainer",
      populate: {
        path: "userId",
        model: "User",
      },
    },
  });

  if (project.length === 0) return { success: true, message: "Project not uploaded yet" };

  return {
    success: true,
    message: "Projects fetched successfully",
    data: project,
  };
};

const getAllProjectsByBatchIdsService = async (batchIds) => {
  const project = await projectModel
    .find({ batchId: { $in: batchIds } })
    .populate("batchId")
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  if (project.length === 0)
    return { success: true, message: "Projects not uploaded yet" };

  return {
    success: true,
    message: "Projects fetched successfully",
    data: project,
  };
};

//POST
const addProjectService = async ({ title, studentId, githubLink }) => {
  const student = await studentModel.findById(studentId);

  if (!student) {
    return { result: false, message: `Student not present ` };
  }

  const batch = await batchModel.findOne({ students: studentId });

  if (!batch) {
    return { success: false, message: "Student batch is not present" };
  }

  const existingProject = await projectModel.findOne({ githubLink });

  if (existingProject) {
    return {
      result: false,
      message: `Project already present using github link ${githubLink}`,
    };
  }

  new projectModel({
    title,
    studentId,
    batchId: batch?._id,
    githubLink,
  }).save();

  return {
    result: true,
    message: `Project added using github link ${githubLink}`,
  };
};

//PUT
const updateFeedbackByIdService = async ({ id, feedback, role }) => {
  const roleKeyMap = {
    technical: "feedbacks.byTrainer",
    labassistant: "feedbacks.byLabAssistant",
  };

  const fieldToUpdate = roleKeyMap[role];

  if (!fieldToUpdate) {
    return { success: false, message: "Invalid role" };
  }

  const update = { [fieldToUpdate]: feedback };

  const project = await projectModel
    .findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true })
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("batchId");

  if (!project) return { success: false, message: "Project is missing" };

  return { success: true, message: "Feedback updated", data: project };
};

//DELETE
const deleteProjectsByIdsService = async (ids) => {
  const project = await projectModel.find({ _id: { $in: ids } });

  if (project.length !== ids.length)
    return { success: false, message: "one of the project is missing" };

  await projectModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "Project deleted" };
};

export default {
  getAllProjectsService,
  getProjectByIdService,
  getAllProjectsByStudentIdService,
  getAllProjectsByBatchIdsService,
  addProjectService,
  updateFeedbackByIdService,
  deleteProjectsByIdsService,
};
