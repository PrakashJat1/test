import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrollmentId: {
      type: String,
      required: true,
      unique: true,
    },
    assigned_batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },

    fatherFullName: String,
    DOB: {
      type: Date,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date should be in the past",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    maritalStatus: {
      type: String,
      enum: ["married", "unmarried"],
    },

    localAddress: String,
    permanentAddress: String,
    state: String,

    college: String,
    qualification: String,
    graduationCompletionYear: Number,

    familyAnnualIncome: String,
    preferredCity: String,

    placementStatus: {
      type: String,
      enum: ["pending", "selected", "rejected"],
      default: "pending",
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("Student", studentSchema);
