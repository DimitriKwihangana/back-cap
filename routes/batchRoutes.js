const express = require('express');
const router = express.Router();
const {
    createBatch,
    getAllBatches,
    getBatchById,
    getBatchByBatchId,
    updateBatch,
    deleteBatch,
    getBatchesByUser,
   
} = require('../controllers/batchcontroller');



// Get batches by user
router.get('/user/:userId?',  getBatchesByUser);

// Get batch by custom batchId
router.get('/batch/:batchId', getBatchByBatchId);

// Basic CRUD routes
router.post('/', createBatch);
router.get('/',  getAllBatches);
router.get('/:id',  getBatchById);
router.put('/:id',  updateBatch);
router.delete('/:id',  deleteBatch);

module.exports = router;