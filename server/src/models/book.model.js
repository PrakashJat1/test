import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    isbn: String,
    category: String,
    totalQty: Number,
    issuedCount: { type: Number, default: 0 },
    addedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

BookSchema.virtual("issueId", {
  localField: "_id",
  ref: "BookIssue",
  foreignField: "bookId",
});

BookSchema.set("toJSON", { virtuals: true });
BookSchema.set("toObject", { virtuals: true });

export default mongoose.model("Book", BookSchema);
