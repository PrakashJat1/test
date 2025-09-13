import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';
import companyController from '../controllers/company.controller.js';

const companyRoute = express.Router();

//Global Middleware
companyRoute.use(verifyToken);

//GET
companyRoute.get('/getById/:id',authorizeRoles('hr','student','admin','management'),companyController.getById);

companyRoute.get('/getAll',authorizeRoles('hr','student','admin','management'),companyController.getAllCompaniesDrive);

companyRoute.get('/getAllByBatchId/:batchId',authorizeRoles('hr','student','admin','management'),companyController.getAllByBatchId);


//POST
companyRoute.post('/addCompany/:uploadedBy',authorizeRoles('admin','hr','management'),companyController.addCompany);

//PUT
companyRoute.put('/updateById/:id',authorizeRoles('admin','hr','management'),companyController.updatedById);

//DELETE
companyRoute.delete('/deleteById/:id',authorizeRoles('admin','hr'),companyController.deleteById);

companyRoute.delete('/deleteAllByIds',authorizeRoles('admin','hr'),companyController.deleteAllByIds);
export default companyRoute;