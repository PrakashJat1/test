import saturdaySessionModel from "../models/saturdaySession.model.js";
import studentModel from "../models/student.model.js";
import userModel from "../models/user.model.js";

//GET
const getAllService = async () => {
  const sessions = await saturdaySessionModel
    .find()
    .populate("uploadedBy")
    .populate("batchIds");

  if (sessions.length === 0)
    return { success: true, message: "Sessions not scheduled yet" };

  return {
    success: true,
    message: "Session fetched successfully",
    data: sessions,
  };
};

const getAllSaturdaySessionsByStudentIdService = async (id) => {
  const student = await studentModel.findById(id);

  if (!student.assigned_batch)
    return {
      success: true,
      message: "Batch not assigned yet for saturday sessions",
    };

  const sessions = await saturdaySessionModel
    .find({
      batchIds: { $in: [student.assigned_batch] },
    })
    .populate("uploadedBy")
    .populate("batchIds");

  if (sessions.length === 0)
    return { success: true, message: "Session not scheduled yet" };

  return {
    success: true,
    message: "Session fetched successfully",
    data: sessions,
  };
};

//POST
const addSaturdaySessionService = async ({
  uploadedBy,
  date,
  topic,
  ExpertName,
  company,
  position,
  timeFrom,
  timeTo,
  batchIds,
}) => {
  const user = await userModel.findById(uploadedBy);

  if (!user) return { success: false, message: "User is not present " };

  const existingSession = await saturdaySessionModel.findOne({
    date,
    batchIds: { $in: batchIds }, // checks for overlapping batches
  });
  if (existingSession)
    return {
      success: false,
      message: `session for any bacth is already scheduled on ${date}`,
    };

  const session = await saturdaySessionModel.create({
    uploadedBy,
    date,
    topic,
    ExpertName,
    company,
    position,
    timeFrom,
    timeTo,
    batchIds,
  });

  const populated = await saturdaySessionModel
    .findById(session._id)
    .populate("uploadedBy")
    .populate("batchIds");

  return { success: true, message: "Session Scheduled", data: populated };
};

//PUT
const updateByIdService = async ({
  id,
  date,
  topic,
  ExpertName,
  company,
  position,
  timeFrom,
  timeTo,
  batchIds,
}) => {
  const existingSession = await saturdaySessionModel.findOne({
    $and: [{ date }, { batchIds: { $in: batchIds } }, { _id: { $ne: id } }],
  });

  if (existingSession)
    return {
      success: false,
      message: `session for any bacth is already scheduled on ${date}`,
    };

  const populatedSession = await saturdaySessionModel
    .findByIdAndUpdate(
      id,
      {
        $set: {
          date,
          topic,
          ExpertName,
          company,
          position,
          timeFrom,
          timeTo,
          batchIds,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("uploadedBy")
    .populate("batchIds");

  return {
    success: true,
    message: "Session updated successfully",
    data: populatedSession,
  };
};

const giveFeedbackService = async ({ studentId, sessionId, feedback }) => {
  const existingSession = await saturdaySessionModel.findById(sessionId);

  if (!existingSession)
    return {
      success: false,
      message: `Session is not present`,
    };

  const populatedSession = await saturdaySessionModel.updateOne(
    { _id: sessionId },
    {
      $push: {
        feedbacks: {
          studentId,
          feedback,
          givenAt: new Date(),
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return {
    success: true,
    message: "Feedback Updated successfully",
    data: populatedSession,
  };
};

const deleteByIdsService = async (ids) => {
  const sessions = await saturdaySessionModel.find({ _id: { $in: ids } });

  if (sessions.length !== ids.length)
    return { success: false, message: "One of the sessions is not present" };

  await saturdaySessionModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "Sessions deleted successfully" };
};

export default {
  getAllService,
  getAllSaturdaySessionsByStudentIdService,
  addSaturdaySessionService,
  updateByIdService,
  giveFeedbackService,
  deleteByIdsService,
};
