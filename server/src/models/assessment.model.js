import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["technical", "softskill", "aptitude"],
      required: true,
    },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    month: { type: String, default: null },
    marks: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        score: {
          type: Number,
          default: 0,
        },
        feedback: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("Assessment", AssessmentSchema);
