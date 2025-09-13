import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    githubLink: { type: String },
    submittedOn: { type: Date, default: Date.now },
    feedbacks: {
      byTrainer: String,
      byLabAssistant: String,
    },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("Project", ProjectSchema);
