import { request, response } from "express";
import adminService from "../services/admin.service.js";
import { InternalServerError } from "../utils/error.util.js";
import bookService from "../services/book.service.js";
import bookissueService from '../services/bookissue.service.js'

//GET
const getBookById = async (request, response) => {
  try {
    const result = await bookService.getBookByIdService(request.params);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "getBook", error);
  }
};

const getAllBooks = async (request, response) => {
  try {
    const result = await bookService.getAllBooksService();

    result.success
      ? response.status(200).json(result.books1)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllBook", error);
  }
};

//POST
const addBook = async (request, response) => {
  try {
    const result = await  bookService.addBookService(request.body);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "addBook", error);
  }
};

const issueRequestByStudent = async (request, response) => {
  try {
    const { studentId, bookId } = request.params;

    const payLoad = {
      studentId: studentId.trim(),
      bookId: bookId.trim(),
    };

    const result = await bookService.issueRequestByStudentService(payLoad);
    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Book Issue Request", error);
  }
};

//PUT
const updateBookById = async (request, response) => {
  try {
    const { id } = request.params;
    const { title, author, isbn, category, totalQty } = request.body;

    const payLoad = {
      id,
      title,
      author,
      isbn,
      category,
      totalQty,
    };
    const result = await bookService.updateBookByIdService(payLoad);

    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "updateBook", error);
  }
};

//DELETE
const deleteBookById = async (request, response) => {
  try {
    const result = await bookService.deleteBookByIdService(request.params);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteBook", error);
  }
};

const deleteAllById = async (request, response) => {
  try {
    const { ids } = request.body;

    const result = await bookService.deleteAllByIdService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteAllBook", error);
  }
};

export default {
  getBookById,
  getAllBooks,
  issueRequestByStudent,
  addBook,
  updateBookById,
  deleteBookById,
  deleteAllById,
};
