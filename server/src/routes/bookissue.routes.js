import express from 'express';
import bookissueController from '../controllers/bookissue.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';

const bookissueRoute = express.Router();

//Global middleware
bookissueRoute.use(verifyToken);

//GET
bookissueRoute.get('/getAllIssuesBooks',authorizeRoles('admin','management'),bookissueController.getAllIssuesBooks);


bookissueRoute.get('/getIssueRequestById/:id',authorizeRoles('admin','management','student'),bookissueController.getIssueRequestById);

bookissueRoute.get('/getIssueRequestByStudentId/:id',authorizeRoles('admin','management','student'),bookissueController.getIssueRequestByStudentId)

//POST API's

//PUT
bookissueRoute.put('/updateIssueRequest/:id',authorizeRoles('admin','manager','student'),bookissueController.updateIssueRequest);

bookissueRoute.put('/approveBooksIssueRequest',authorizeRoles('admin','management'),bookissueController.approveBooksIssueRequest);

bookissueRoute.put('/rejectBooksIssueRequest',authorizeRoles('admin','management'),bookissueController.rejectBooksIssueRequest);

bookissueRoute.delete('/deleteAllById',authorizeRoles('admin'),bookissueController.deleteAllById);


export default bookissueRoute;
