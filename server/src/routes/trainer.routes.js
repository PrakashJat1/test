import express from 'express';
import trainerController from '../controllers/trainer.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';

const trainerRouter = express.Router();

trainerRouter.use(verifyToken); //Global Middleware

//GET
trainerRouter.get('/getAll',authorizeRoles('admin','management'),trainerController.getAll);

trainerRouter.get('/getTrainerById/:id',authorizeRoles('admin','management'),trainerController.getTrainerById);

trainerRouter.get('/getTrainerByUserId/:id',authorizeRoles('admin','management','technical','softskill','aptitude'),trainerController.getTrainerByUserId);

//POST
trainerRouter.post('/add-trainer',authorizeRoles('admin'),trainerController.addTrainer);

trainerRouter.put('/assignBatches',authorizeRoles('admin','management'),trainerController.assignBatches);

trainerRouter.put('/removeAssignedBatches',authorizeRoles('admin','management'),trainerController.removeAssignedBatches);


//DELETE
trainerRouter.delete('/deleteTrainer/:id',authorizeRoles('admin'),trainerController.deleteTrainer);

export default trainerRouter;