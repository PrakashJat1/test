import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';
import itepapplicantController from '../controllers/itepapplicant.controller.js';

const itepApplicantRoute = express.Router();

//Global middleware
itepApplicantRoute.use(verifyToken); 

//GET
itepApplicantRoute.get('/getAll',authorizeRoles('admin','management'),itepapplicantController.getAll);

itepApplicantRoute.get('/getAllCurrentMonthApplicants',authorizeRoles('admin','management'),itepapplicantController.getCurrentMonthRegisteredApplicants);


//PUT
itepApplicantRoute.put('/updateApplicantsStatusForExam',authorizeRoles('admin','management'),itepapplicantController.updateApplicantsStatusForExam);

itepApplicantRoute.put('/updateApplicantsStatusForSelection',authorizeRoles('admin','management'),itepapplicantController.updateApplicantsStatusForSelection);


//DELETE
itepApplicantRoute.delete('/deleteApplicants',authorizeRoles('admin'),itepapplicantController.deleteApplicants);

export default itepApplicantRoute;