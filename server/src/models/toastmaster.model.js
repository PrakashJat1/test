import mongoose from "mongoose";

const ToastmastersSchema = new mongoose.Schema(
  {
    date: Date,
    theme: String,
    wordOfDay: String,
    idiom: String,
    hostedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    roles: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        role: {
          type: String,
          enum: [
            "Toastmaster of the Day",
            "Grammarian",
            "Prepared Speech 1",
            "Prepared Speech 2",
            "General Evaluator",
            "Evaluator 1",
            "Evaluator 2",
            "Table Topic Master",
            "Impromptu Speaker 1",
            "Impromptu Speaker 2",
            "Impromptu Speaker 3",
            "Ah-Counter",
            "Timer",
          ],
          required: true,
        },
        feedback: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("ToastMaster", ToastmastersSchema);
