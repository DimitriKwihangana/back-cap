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


router.get('/orders/seller/:sellerId', getOrdersForSeller);        
router.put('/orders/:orderId/status', updateOrderStatus);          
router.get('/orders/:orderId', getOrderDetails);                   
router.get('/orders/batch/:batchId', getOrdersForBatch);           

// Order tracking for buyers
router.get('/orders/buyer/:buyerEmail', getOrdersForBuyer);          


router.get('/market', getMarketBatches);                          
router.get('/market/:id', getMarketBatchById);                    
router.put('/:id/market', putBatchOnMarket);                      
router.delete('/:id/market', removeBatchFromMarket);              
router.post('/:id/purchase', updateBatchQuantity);                


router.get('/user/:userId?', getBatchesByUser);


router.get('/batch/:batchId', getBatchByBatchId);

// Basic CRUD routes
router.post('/', createBatch);
router.get('/', getAllBatches);
router.get('/:id', getBatchById);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

module.exports = router;