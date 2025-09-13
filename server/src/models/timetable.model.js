import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema(
  {
    Name : {
      type : String,
      required : true,
      unique : true
    },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    file: {
      public_id: String,
      secure_id: String,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("TimeTable", TimetableSchema);
