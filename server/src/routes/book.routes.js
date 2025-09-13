import express, { request, response } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';
import bookController from '../controllers/book.controller.js';

const bookRoute = express.Router();

bookRoute.use(verifyToken);

//GET
bookRoute.get('/getBookById/:id',authorizeRoles('admin','student','management'),bookController.getBookById);

bookRoute.get('/getAllBooks',authorizeRoles('admin','management','student'),bookController.getAllBooks);

//POST
bookRoute.post('/addBook',authorizeRoles('admin','management'),bookController.addBook);

bookRoute.post('/issueRequestByStudent/:studentId/:bookId',authorizeRoles('student'),bookController.issueRequestByStudent);

//PUT
bookRoute.put('/updateBookById/:id',authorizeRoles('admin','management'),bookController.updateBookById);

//DELETE
bookRoute.delete('/deleteBookById/:id',authorizeRoles('admin'),bookController.deleteBookById);

bookRoute.delete('/deleteAllById',authorizeRoles('admin'),bookController.deleteAllById);


export default bookRoute;