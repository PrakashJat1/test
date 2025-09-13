import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batch_Name: {
      type: String,
      unique: true,
      required: true,
    },
    batch_No : {
      type : Number,
      unique :true,
      required : true
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "upcoming"],
      default: "upcoming",
    },
    start_Date: {
      type: Date,
      default: new Date(),
    },
    end_Date: Date,
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    technicalTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    softskillTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    aptitudeTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

//pre-hook for default end date
batchSchema.pre("save", function (next) {
  if (!this.end_Date) {
    const oneYearLater = new Date(this.start_Date);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    this.end_Date = oneYearLater;
  }
  next();
});

export default mongoose.model("Batch", batchSchema);
