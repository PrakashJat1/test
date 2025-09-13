import express, { request, response } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';
import studentController from '../controllers/student.controller.js';


const studentRoute = express.Router();

studentRoute.use(verifyToken);

//GET
studentRoute.get('/getAll',authorizeRoles('admin','management','hr'),studentController.getAll);
studentRoute.get('/getStudentByUserId/:id',authorizeRoles('admin','management','trainer','student'),studentController.getStudentByUserId);

//POST
studentRoute.post('/addStudent',authorizeRoles('admin','management'),studentController.addStudent);

//PUT
studentRoute.put('/assignBatch',authorizeRoles('admin','management'),studentController.assignBatch);

studentRoute.put('/updateStudentsPlacementStatus',authorizeRoles('hr','admin','management'),studentController.updateStudentsPlacementStatus);

//DELETE
studentRoute.delete('/deleteStudent/:id',authorizeRoles('admin'),studentController.deleteStudent);
export default studentRoute;