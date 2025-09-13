import bookModel from "../models/book.model.js";
import bookissueModel from "../models/bookissue.model.js";
import studentModel from "../models/student.model.js";

//GET
const getBookByIdService = async ({ id }) => {
  const book = await bookModel.findById(id);

  if (!book) return { success: false, message: "Book is not present" };

  return { success: true, message: "Book feteched successfully", data: book };
};

const getAllBooksService = async () => {
  const books = await bookModel.find().populate("issueId");

  if (books.length === 0)
    return { success: true, message: "Books list is empty" };

  return { success: true, message: "Books fetched", books1: books };
};

//POST
const addBookService = async ({ title, author, isbn, category, totalQty }) => {
  const book = await bookModel.findOne({ isbn });

  if (book) {
    return {
      success: false,
      message: `Book already present with isbn ${isbn}`,
    };
  }

  new bookModel({
    title,
    author,
    isbn,
    category,
    totalQty,
  }).save();

  return { success: true, message: `Book added with isbn ${isbn}` };
};

const issueRequestByStudentService = async ({ studentId, bookId }) => {
  const student = await studentModel.findById(studentId);

  if (!student) {
    return { success: false, message: `Student not present` };
  }

  const book = await bookModel.findById(bookId);

  if (!book) {
    return { success: false, message: `Book not present` };
  }

  await new bookissueModel({
    studentId,
    bookId,
  }).save();

  book.issuedCount += 1;
  await book.save();

  return { success: true, message: `Request Sent for book ${book.title}` };
};

//PUT
const updateBookByIdService = async ({
  id,
  title,
  author,
  isbn,
  category,
  totalQty,
}) => {
  if (!id) {
    return { success: false, message: "Book ID is required" };
  }

  if (isbn) {
    const existingIsbn = await bookModel.findOne({ isbn });
    if (existingIsbn && existingIsbn._id.toString() !== id) {
      return { success: false, message: "ISBN already exists" };
    }
  }

  const updatedBook = await bookModel.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(author && { author }),
      ...(isbn && { isbn }),
      ...(category && { category }),
      ...(totalQty !== undefined && { totalQty }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBook) {
    return { success: false, message: "Book not found" };
  }

  return {
    success: true,
    message: "Book updated successfully",
    data: updatedBook,
  };
};

//DELETE
const deleteBookByIdService = async ({ id }) => {
  const book = await bookModel.findById(id);

  if (!book) return { success: false, message: "Book is not present" };

  const bookIssue = await bookissueModel.findOneAndUpdate(
    { bookId: id },
    {
      $set: { bookId: null },
    }
  );

  return { success: true, message: "Book deleted" };
};

const deleteAllByIdService = async (ids) => {
  const books = await bookModel.find({ _id: { $in: ids } });

  if (books.length !== ids.length)
    return { success: false, message: "One of the Book is not present" };

  await bookModel.deleteMany({ _id: { $in: ids } });
  await bookissueModel.deleteMany({ bookId: { $in: ids } });

  const bookIssue = await bookissueModel.deleteMany(
    { _id: { $in: ids } },
    {
      $set: { bookId: null },
    }
  );

  return { success: true, message: "Books deleted" };
};

export default {
  getBookByIdService,
  getAllBooksService,
  addBookService,
  issueRequestByStudentService,
  updateBookByIdService,
  deleteBookByIdService,
  deleteAllByIdService,
};
