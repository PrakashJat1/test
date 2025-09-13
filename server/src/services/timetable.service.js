import batchModel from "../models/batch.model.js";
import studentModel from "../models/student.model.js";
import timetableModel from "../models/timetable.model.js";
import userModel from "../models/user.model.js";
import fileUtil from "../utils/file.util.js";

//GET
const getAllService = async () => {
  const timetables = await timetableModel
    .find()
    .populate("batchId")
    .populate("uploadedBy");

  if (timetables.length === 0)
    return { success: true, message: "Time tables not present" };

  return {
    success: true,
    message: "Time tables fetched successfully",
    data: timetables,
  };
};

const getAllByStudentIdService = async (id) => {
  const student = await studentModel.findById(id);

  if (!student) return { success: false, message: "Student is not present" };

  if (!student.assigned_batch)
    return { success: false, message: "batch is not present" };

  const timetable = await timetableModel
    .find({ batchId: student.assigned_batch })
    .populate("batchId")
    .populate("uploadedBy");

  if (timetable.length === 0)
    return { success: true, message: "Time table list is empty" };

  return {
    success: true,
    message: "Time table fetched successfully",
    data: timetable,
  };
};

const getByIdService = async (id) => {
  const timetable = await timetableModel
    .findById(id)
    .populate("batchId")
    .populate("uploadedBy");

  if (!timetable) return { success: false, message: "Time table not present" };

  return {
    success: true,
    message: "Time table fetched successfully",
    data: timetable,
  };
};

//POST
const addTimeTableService = async ({ uploadedBy, Name, batchId, file }) => {
  const user = await userModel.findOne({ _id: uploadedBy });

  if (!user) return { success: false, message: "User is not present " };

  const batch = await batchModel.findById(batchId);

  if (!batch) return { success: false, message: `batch not exist` };

  const existing = await timetableModel.findOne({ Name });

  if (existing) return { success: false, message: `${Name} already exist` };

  if (!file || !file.buffer)
    return { success: false, message: `File is missing` };

  const timetable = await fileUtil.uploadFileToCloudinary(
    file.buffer,
    "management/timetable",
    "auto",
    file.originalname
  );

  if (!timetable) return { success: false, message: "Failed to upload" };

  await new timetableModel({
    Name,
    batchId,
    file: {
      public_id: timetable.public_id,
      secure_id: timetable.secure_url,
    },
    uploadedBy,
  }).save();

  return { success: true, message: "Uploaded Successfully" };
};

//PUT
const editTimeTableService = async ({ id, Name, batchId, file }) => {
  const existing = await timetableModel.findById(id);

  if (!existing) return { success: false, message: `Time Table Not exist` };

  if (!file || !file.buffer)
    return { success: false, message: `File is missing` };

  const timetable = await fileUtil.uploadFileToCloudinary(
    file.buffer,
    "management/timetable",
    "auto",
    file.originalname
  );

  if (!timetable) return { success: false, message: "Failed to upload" };

  await timetableModel.updateOne(
    { _id: id },
    {
      Name,
      batchId,
      file: {
        public_id: timetable.public_id,
        secure_id: timetable.secure_url,
      },
      uploadedOn: Date.now(),
    }
  );

  return { success: true, message: "Timetable Updated Successfully" };
};

//DELETE
const deleteByIdService = async (id) => {
  const timetable = await timetableModel.findByIdAndDelete(id);

  if (!timetable) return { success: false, message: "Time table not present" };

  await fileUtil.deleteCloudinaryFile(timetable.file.public_id);

  return {
    success: true,
    message: "Time table deleted successfully",
    data: timetable,
  };
};

const deleteByIdsService = async (ids) => {
  const timetables = await timetableModel.find({ _id: { $in: ids } });

  if (timetables.length !== ids.length)
    return { success: false, message: "One of the time table is missing" };

  timetables.forEach(async (timetable) => {
    await fileUtil.deleteCloudinaryFile(timetable.file.public_id);
  });

  await timetableModel.deleteMany({ _id: { $in: ids } });
  return {
    success: true,
    message: "Time tables deleted successfully",
  };
};

export default {
  getAllService,
  getAllByStudentIdService,
  getByIdService,
  addTimeTableService,
  editTimeTableService,
  deleteByIdService,
  deleteByIdsService,
};
