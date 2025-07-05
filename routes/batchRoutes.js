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
    // NEW MARKETPLACE FUNCTIONS
    putBatchOnMarket,
    removeBatchFromMarket,
    getMarketBatches,
    getMarketBatchById,
    updateBatchQuantity
} = require('../controllers/batchcontroller');

// MARKETPLACE ROUTES (Add these new ones)
router.get('/market', getMarketBatches);                    // GET /api/batches/market - Get all market batches
router.get('/market/:id', getMarketBatchById);              // GET /api/batches/market/:id - Get specific market batch
router.put('/:id/market', putBatchOnMarket);                // PUT /api/batches/:id/market - List batch on market
router.delete('/:id/market', removeBatchFromMarket);        // DELETE /api/batches/:id/market - Remove from market
router.post('/:id/purchase', updateBatchQuantity);          // POST /api/batches/:id/purchase - Purchase quantity

// EXISTING ROUTES (unchanged)
// Get batches by user
router.get('/user/:userId?', getBatchesByUser);

// Get batch by custom batchId
router.get('/batch/:batchId', getBatchByBatchId);

// Basic CRUD routes
router.post('/', createBatch);
router.get('/', getAllBatches);
router.get('/:id', getBatchById);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

module.exports = router;