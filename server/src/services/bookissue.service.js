import { model } from "mongoose";
import bookModel from "../models/book.model.js";
import bookissueModel from "../models/bookissue.model.js";
import studentModel from "../models/student.model.js";

//GET
const getAllIssuesBooksService = async () => {
  const books = await bookissueModel
    .find()
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("bookId");

  if (books.length === 0)
    return { success: true, message: "Books Issues list is empty" };

  return { success: true, message: "Books Issues fetched", books1: books };
};

const getIssueRequestByIdService = async (id) => {
  const issueRequest = await bookissueModel.findById(id);

  if (!issueRequest)
    return { success: false, message: "Book Issue Request is not present" };

  return { success: true, message: "Fetched successfully", data: issueRequest };
};

const getIssueRequestByStudentIdService = async (id) => {
  const issueRequests = await bookissueModel
    .find({ studentId: id })
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate("bookId");

  if (!issueRequests)
    return { success: false, message: "Book Issue Request is not present" };

  return {
    success: true,
    message: "Fetched successfully",
    data: issueRequests,
  };
};

//PUT
const updateIssueRequestService = async ({ id, status }) => {
  const validStatuses = ["rejected", "issued", "returned"];
  if (!validStatuses.includes(status)) {
    return { success: false, message: "Invalid book issue status" };
  }

  const issueRequest = await bookissueModel.findByIdAndUpdate(
    id,
    {
      $set: { status: status, returnedOn: Date.now() },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (status === "returned") {
    await bookModel.findOneAndUpdate(
      { _id: issueRequest.bookId },
      {
        $inc: { issuedCount: -1 },
      }
    );
  }

  return {
    success: true,
    message: "Status updated successfully",
    data: issueRequest,
  };
};

const approveBooksIssueRequestService = async (ids, status) => {
  const bookIssues = await bookissueModel.find({ _id: { $in: ids } });

  if (bookIssues.length !== ids.length)
    return { success: false, message: "Any of the book issue is not present" };

  await bookissueModel.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        status,
        issuedOn: Date.now(),
      },
    }
  );

  const bookIds = bookIssues.map((b) => b.bookId);

  if (status === "issued") {
    await bookModel.updateMany(
      { _id: { $in: bookIds } },
      { $inc: { issuedCount: 1 } }
    );
  }

  return {
    success: true,
    message: "Status updated successfully",
  };
};

const rejectBooksIssueRequestService = async (ids, status) => {
  const bookIssues = await bookissueModel.find({ _id: { $in: ids } });

  if (bookIssues.length !== ids.length)
    return { success: false, message: "Any of the book issue is not present" };

  await bookissueModel.updateMany(
    { _id: { $in: ids } },
    { $set: { status: status } }
  );

  return {
    success: true,
    message: "Status updated successfully",
  };
};

const deleteAllByIdService = async (ids) => {
  const books = await bookissueModel.find({ _id: { $in: ids } });

  if (books.length !== ids.length)
    return {
      success: false,
      message: "One of the Book Issue data is not present",
    };

  await bookModel.updateMany(
    { _id: { $in: ids } },
    {
      $set: { issuedCount: 0 },
    }
  );

  const bookIssue = await bookissueModel.deleteMany({ _id: { $in: ids } });

  return { success: true, message: "BookIssues deleted" };
};

export default {
  getAllIssuesBooksService,
  getIssueRequestByIdService,
  getIssueRequestByStudentIdService,
  updateIssueRequestService,
  approveBooksIssueRequestService,
  rejectBooksIssueRequestService,
  deleteAllByIdService,
};
