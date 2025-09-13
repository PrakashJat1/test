
import batchController from '../controllers/batch.controller.js';
import express from 'express'
import { verifyToken } from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';

const batchRoute = express.Router();

batchRoute.use(verifyToken);

//GET
batchRoute.get('/getAll',authorizeRoles('admin','management','hr'),batchController.getAll);

batchRoute.get('/getBatchById/:id',authorizeRoles('admin','management','trainer'),batchController.getBatchById);

batchRoute.post('/nonAssignedbatchesbyTypeOfTrainer',authorizeRoles('admin','management'),batchController.nonAssignedbatchesbyTypeOfTrainer);

//POST
batchRoute.post('/fetchAllNonAssignedBatchesForAssignNewBatches',authorizeRoles('admin','management'),batchController.fetchAllNonAssignedBatchesForAssignNewBatches);

batchRoute.post('/addBatch',authorizeRoles('admin','management'),batchController.addBatch);

//PUT
batchRoute.put('/addStudentsInBatch/:batchId',authorizeRoles('admin','management'),batchController.addStudentsInBatch);

batchRoute.put('/removeStudentsFromBatch/:batchId',authorizeRoles('admin','management'),batchController.removeStudentsFromBatch);

batchRoute.put('/assignNewByTypeOfTrainer/:batchId',authorizeRoles('admin','management'),batchController.assignNewByTypeOfTrainer);

batchRoute.put('/removeTrainerFromBatchByTypeOfTrainer/:id',authorizeRoles('admin','management'),batchController.removeTrainerFromBatchByTypeOfTrainer);

batchRoute.put('/editBatch',authorizeRoles('admin','management'),batchController.editBatch);
//DELETE
batchRoute.delete('/deleteBatches',authorizeRoles('admin'),batchController.deleteBatches);


export default batchRoute;