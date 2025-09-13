import mongoose from "mongoose";

const itep_applicantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: String,
    email: String,
    password: String,
    fatherFullName: String,
    mobileNo: String,
    DOB: {
      type: Date,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date should be in past",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    localAddress: String,
    permanentAddress: String,
    state: String,
    maritalStatus: {
      type: String,
      enum: ["married", "unmarried"],
    },
    college: String,
    qualification: String,
    graduationCompletionYear: Number,
    familyAnnualIncome: String,
    preferredCity: String,
    fromWhereYouFindAboutITEP: String,
    photo: {
      public_id: String,
      secure_url: String,
    },
    documentsPDF: {
      public_id: String,
      secure_url: String,
    },
    fatherIncomeCerificate: {
      public_id: String,
      secure_url: String,
    },
    examAllowed: {
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    status: {   //final selection
      type: String,
      enum: ["pending", "selected", "rejected"],
      default: "pending",
    },
    appliedOn: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("ITEPApplicant", itep_applicantSchema);
