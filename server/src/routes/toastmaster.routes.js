import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';
import toastmasterController from '../controllers/toastmaster.controller.js';

const toastmasterRoute = express.Router();

toastmasterRoute.use(verifyToken);

//GET
toastmasterRoute.get('/getById/:id',authorizeRoles('admin','hr','management'),toastmasterController.getById);

toastmasterRoute.get('/getAll',authorizeRoles('admin','hr','management'),toastmasterController.getAll);

toastmasterRoute.get('/getAllSessionsByBatchId/:id',authorizeRoles('admin','hr','management','student'),toastmasterController.getAllSessionsByBatchId);


//POST
toastmasterRoute.post('/create-toastmaster/:hostedBy/:batch',authorizeRoles('admin','hr'),toastmasterController.createToastMaster);


//PUT
toastmasterRoute.put('/update-toastmasterRoles/:id',authorizeRoles('admin','hr'),toastmasterController.updateToastmasterRoles);

toastmasterRoute.put('/editToasterMasterById/:id',authorizeRoles('admin','hr'),toastmasterController.editToasterMasterById);

//DELETE
toastmasterRoute.delete('/deleteById/:id',authorizeRoles('admin','hr'),toastmasterController.deleteById);

toastmasterRoute.delete('/deleteToastmasterSessions',authorizeRoles('admin','hr'),toastmasterController.deleteToastmasterSessions);

export default toastmasterRoute;