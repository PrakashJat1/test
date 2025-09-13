import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';
import timetableController from '../controllers/timetable.controller.js';
import upload from '../middlewares/multer.middleware.js';

const timetableRoute = express.Router();

timetableRoute.use(verifyToken);

//GET
timetableRoute.get('/getAll',authorizeRoles('admin','management'),timetableController.getAll);

timetableRoute.get('/getAllByStudentId/:id',authorizeRoles('admin','management','student'),timetableController.getAllByStudentId)

timetableRoute.get('/getById/:id',authorizeRoles('admin','management'),timetableController.getById);


//POST
timetableRoute.post('/addTimeTable',authorizeRoles('admin','management'),upload.single('timetable'),timetableController.addTimeTable);

//PUT
timetableRoute.put('/editTimeTable/:id',authorizeRoles('admin','management'),upload.single('timetable'),timetableController.editTimeTable);


//DELETE
timetableRoute.delete('/deleteById/:id',authorizeRoles('admin','management'),timetableController.deleteById);

timetableRoute.delete('/deleteByIds',authorizeRoles('admin','management'),timetableController.deleteByIds);

export default timetableRoute;

