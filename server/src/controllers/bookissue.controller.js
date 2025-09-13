import { request, response } from "express";
import bookissueService from "../services/bookissue.service.js";
import { InternalServerError } from "../utils/error.util.js";

//GET
const getAllIssuesBooks = async (request, response) => {
  try {
    const result = await bookissueService.getAllIssuesBooksService();

    result.success
      ? response.status(200).json(result.books1)
      : response.status(404).json(result.message);
  } catch (error) {
    InternalServerError(response, "getAllIssuesBooks", error);
  }
};

const getIssueRequestById = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await bookissueService.getIssueRequestByIdService(id);
    result.success
      ? response.status(200).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Get Book Issue Request By ID", error);
  }
};

const getIssueRequestByStudentId = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await bookissueService.getIssueRequestByStudentIdService(id);
    result.success
      ? response.status(200).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(
      response,
      "Get Book Issue Request By Student Id",
      error
    );
  }
};

//POST

//PUT
const updateIssueRequest = async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    const payLoad = {
      id,
      status,
    };

    const result = await bookissueService.updateIssueRequestService(payLoad);
    result.success
      ? response.status(201).json(result.data)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Book Issue Request Update", error);
  }
};

const approveBooksIssueRequest = async (request, response) => {
  try {
    const { ids, status } = request.body;

    const result = await bookissueService.approveBooksIssueRequestService(
      ids,
      status
    );
    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Book Issued ", error);
  }
};

const rejectBooksIssueRequest = async (request, response) => {
  try {
    const { ids, status } = request.body;

    const result = await bookissueService.rejectBooksIssueRequestService(
      ids,
      status
    );
    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "Book Issue Request Rejected ", error);
  }
};

const deleteAllById = async (request, response) => {
  try {
    const { ids } = request.body;

    const result = await bookissueService.deleteAllByIdService(ids);

    result.success
      ? response.status(201).json(result.message)
      : response.status(409).json(result.message);
  } catch (error) {
    InternalServerError(response, "deleteAllById", error);
  }
};

export default {
  getAllIssuesBooks,
  getIssueRequestById,
  getIssueRequestByStudentId,
  updateIssueRequest,
  approveBooksIssueRequest,
  rejectBooksIssueRequest,
  deleteAllById,
};
