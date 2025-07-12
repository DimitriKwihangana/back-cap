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
    // MARKETPLACE FUNCTIONS
    putBatchOnMarket,
    removeBatchFromMarket,
    getMarketBatches,
    getMarketBatchById,
    updateBatchQuantity,
    // NEW ORDER MANAGEMENT FUNCTIONS
    getOrdersForSeller,
    updateOrderStatus,
    getOrderDetails,
    getOrdersForBatch,
    getOrdersForBuyer
} = require('../controllers/batchcontroller');

// ============================================================================
// ORDER MANAGEMENT ROUTES
// ============================================================================

// Order management for sellers
router.get('/orders/seller/:sellerId', getOrdersForSeller);        // GET /api/batches/orders/seller/:sellerId - Get all orders for seller
router.put('/orders/:orderId/status', updateOrderStatus);          // PUT /api/batches/orders/:orderId/status - Update order status
router.get('/orders/:orderId', getOrderDetails);                   // GET /api/batches/orders/:orderId - Get specific order details
router.get('/orders/batch/:batchId', getOrdersForBatch);           // GET /api/batches/orders/batch/:batchId - Get orders for specific batch

// Order tracking for buyers
router.get('/orders/buyer/:buyerId', getOrdersForBuyer);           // GET /api/batches/orders/buyer/:buyerId - Get orders for buyer

// ============================================================================
// MARKETPLACE ROUTES
// ============================================================================

router.get('/market', getMarketBatches);                           // GET /api/batches/market - Get all market batches
router.get('/market/:id', getMarketBatchById);                     // GET /api/batches/market/:id - Get specific market batch
router.put('/:id/market', putBatchOnMarket);                       // PUT /api/batches/:id/market - List batch on market
router.delete('/:id/market', removeBatchFromMarket);               // DELETE /api/batches/:id/market - Remove from market
router.post('/:id/purchase', updateBatchQuantity);                 // POST /api/batches/:id/purchase - Purchase quantity (creates order)

// ============================================================================
// EXISTING BATCH ROUTES
// ============================================================================

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