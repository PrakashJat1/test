import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    roleOffered: String,
    packageOffered: String,
    driveDate: Date,
    websiteLink: String,
    roundsInfo: String,
    batchIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    ],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("Company", CompanySchema);
