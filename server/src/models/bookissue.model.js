import mongoose from "mongoose";

const BookIssueSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    requestedOn: { type: Date, default: Date.now },
    issuedOn: Date,
    dueDate: {
      type: Date,
      default: Date.now,
    },
    returnedOn: Date,
    status: {
      type: String,
      enum: ["requested","rejected", "issued", "returned"],
      default: "requested",
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("BookIssue", BookIssueSchema);
