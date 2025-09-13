import mongoose from "mongoose";

const PDFUploadSchema = new mongoose.Schema(
  {
    title: String,
    fileType: { type: String, enum: ["notes", "assignment",'interview-question'] },
    fileLink: {
      public_id: String,
      secure_id: String,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    targetBatchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],
    uploadedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("PDF", PDFUploadSchema);
