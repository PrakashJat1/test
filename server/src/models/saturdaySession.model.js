import mongoose from "mongoose";

const SaturdaySessionSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: Date,
    topic: String,
    ExpertName: String,
    company: String,
    position: String,
    timeFrom: String,
    timeTo: String,
    batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],
    feedbacks: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        feedback: {
          type: String,
          default: "",
          trim: true,
        },
        givenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("SaturdaySession", SaturdaySessionSchema);
