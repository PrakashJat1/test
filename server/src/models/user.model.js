import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "itep-applicant",
        "student",
        "trainer",
        "hr",
        "management",
      ],
      default: "itep-applicant",
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    status: {
      //for active or blocked
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null, // 2 minutes from now
    },
    isverified: {
      //for otp verification
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

userSchema.virtual("studentProfile", {
  ref: "Student",
  localField: "_id",
  foreignField: "userid",
});

userSchema.virtual("trainerProfile", {
  ref: "Trainer",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("itepApplicantProfile", {
  ref: "ITEPApplicant",
  localField: "_id",
  foreignField: "userId",
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);
