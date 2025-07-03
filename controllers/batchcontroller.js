
// Updated Controller
const Batch = require('../models/batch');

// Create a new batch
const createBatch = async (req, res) => {
    try {
        // Now all data comes from req.body, including userId and userName
        const batchData = {
            batchId: req.body.batchId,
            supplier: req.body.supplier,
            date: req.body.date,
            userId: req.body.userId,
            userName: req.body.userName,
            moisture_maize_grain: req.body.moisture_maize_grain,
            Immaturegrains: req.body.Immaturegrains,
            Discolored_grains: req.body.Discolored_grains,
            broken_kernels_percent_maize_grain: req.body.broken_kernels_percent_maize_grain,
            foreign_matter_percent_maize_grain: req.body.foreign_matter_percent_maize_grain,
            pest_damaged: req.body.pest_damaged,
            rotten: req.body.rotten,
            Liveinfestation: req.body.Liveinfestation,
            abnormal_odours_maize_grain: req.body.abnormal_odours_maize_grain,
            aflatoxin: req.body.aflatoxin
        };

        // Validate required fields
        const requiredFields = [
            'batchId', 'supplier', 'date', 'userId', 'userName',
            'moisture_maize_grain', 'Immaturegrains', 'Discolored_grains',
            'broken_kernels_percent_maize_grain', 'foreign_matter_percent_maize_grain',
            'pest_damaged', 'rotten', "aflatoxin"
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate binary fields
        if (req.body.Liveinfestation !== 0 && req.body.Liveinfestation !== 1) {
            return res.status(400).json({
                success: false,
                message: 'Liveinfestation must be 0 or 1'
            });
        }

        if (req.body.abnormal_odours_maize_grain !== 0 && req.body.abnormal_odours_maize_grain !== 1) {
            return res.status(400).json({
                success: false,
                message: 'abnormal_odours_maize_grain must be 0 or 1'
            });
        }

        const newBatch = new Batch(batchData);
        const savedBatch = await newBatch.save();

        res.status(201).json({
            success: true,
            message: 'Batch created successfully',
            data: savedBatch
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating batch',
            error: error.message
        });
    }
};

// Get all batches
const getAllBatches = async (req, res) => {
    try {
        const { page = 1, limit = 10, supplier, userId } = req.query;
        
        let query = {};
        if (supplier) query.supplier = supplier;
        if (userId) query.userId = userId;

        const batches = await Batch.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Batch.countDocuments(query);

        res.status(200).json({
            success: true,
            data: batches,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching batches',
            error: error.message
        });
    }
};

// Get batch by ID
const getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching batch',
            error: error.message
        });
    }
};

// Get batch by batchId
const getBatchByBatchId = async (req, res) => {
    try {
        const batch = await Batch.findOne({ batchId: req.params.batchId });
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching batch',
            error: error.message
        });
    }
};

// Update batch
const updateBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Batch updated successfully',
            data: updatedBatch
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating batch',
            error: error.message
        });
    }
};

// Delete batch
const deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        await Batch.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Batch deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting batch',
            error: error.message
        });
    }
};

// Get batches by user
const getBatchesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { page = 1, limit = 10 } = req.query;

        const batches = await Batch.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Batch.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: batches,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user batches',
            error: error.message
        });
    }
};

module.exports = {
    createBatch,
    getAllBatches,
    getBatchById,
    getBatchByBatchId,
    updateBatch,
    deleteBatch,
    getBatchesByUser
};