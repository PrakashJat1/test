import companyModel from "../models/company.model.js";
import userModel from "../models/user.model.js";

//GET
const getByIdService = async (id) => {
  const drive = await companyModel.findById(id).populate("uploadedBy");
  if (!drive) return { success: false, message: "Not Drive Present" };

  return { success: true, message: "Drive fetched", data: drive };
};

const getAllCompaniesDriveService = async () => {
  const drives = await companyModel
    .find()
    .populate("uploadedBy")
    .populate("batchIds");
  if (drives.length === 0) return { success: true, message: "Not Drives yet" };

  return { success: true, message: "Drives fetched", data: drives };
};

const getAllByBatchIdService = async (batchId) => {
  const drives = await companyModel
    .find({ batchIds: { $in: [batchId] } })
    .populate("uploadedBy");
  if (drives.length === 0) return { success: true, message: "Not Drives yet" };

  return { success: true, message: "Drives fetched", data: drives };
};

//POST
const addCompanyService = async ({
  uploadedBy,
  name,
  roleOffered,
  packageOffered,
  driveDate,
  websiteLink,
  roundsInfo,
  batchIds,
}) => {
  const user = await userModel.findById(uploadedBy);

  if (!user) return { success: false, message: "user is not present" };

  const newCompany = await new companyModel({
    uploadedBy,
    name,
    roleOffered,
    packageOffered,
    driveDate,
    websiteLink,
    roundsInfo,
    batchIds,
  }).save();

  const populated = newCompany.populate("uploadedBy");

  return {
    success: true,
    message: `${name} added successfully`,
    data: populated,
  };
};

//PUT
const updateByIdService = async ({
  id,
  name,
  roleOffered,
  packageOffered,
  driveDate,
  websiteLink,
  roundsInfo,
  batchIds,
}) => {
  const updatedCompany = await companyModel
    .findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          roleOffered,
          packageOffered,
          driveDate,
          websiteLink,
          roundsInfo,
          batchIds,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("uploadedBy");

  if (!updatedCompany)
    return { success: false, message: "Company not present" };

  return {
    success: true,
    message: `${name} updated successfully`,
    data: updatedCompany,
  };
};

//DELETE
const deleteByIdService = async (id) => {
  const company = await companyModel.findById(id);

  if (!company) return { success: false, message: "Company not Exist" };

  return { success: true, message: "Company Deleted", data: company };
};

const deleteAllByIdsService = async (ids) => {
  await companyModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "Companies Deleted" };
};

export default {
  getByIdService,
  getAllCompaniesDriveService,
  getAllByBatchIdService,
  addCompanyService,
  updateByIdService,
  deleteByIdService,
  deleteAllByIdsService,
};
