import express from  'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';
import saturdaySessionController from '../controllers/saturdaySession.controller.js';

const saturdaySessionRoute = express.Router();

//Global Middleware
saturdaySessionRoute.use(verifyToken);

//GET
saturdaySessionRoute.get('/getAll',authorizeRoles('admin','management'),saturdaySessionController.getAll);


saturdaySessionRoute.get('/getAllSaturdaySessionsByStudentId/:id',authorizeRoles('student','admin','management'),saturdaySessionController.getAllSaturdaySessionsByStudentId);


//POST
saturdaySessionRoute.post('/addSaturdaySession',authorizeRoles('admin','management'),saturdaySessionController.addSaturdaySession);

//PUT
saturdaySessionRoute.put('/updateById/:id',authorizeRoles('admin','management'),saturdaySessionController.updateById);

saturdaySessionRoute.put('/giveFeedback/:studentId/:sessionId',authorizeRoles('student'),saturdaySessionController.giveFeedback);


//DELETE
saturdaySessionRoute.delete('/deleteAllByIds',authorizeRoles('admin'),saturdaySessionController.deleteByIds);
export default saturdaySessionRoute;