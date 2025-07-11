// Enhanced Controller with Email Notifications
const Batch = require('../models/batch');
const User = require('../models/User'); 
const nodemailer = require('nodemailer'); // You'll need to install this: npm install nodemailer

// Email configuration (you'll need to set up your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send notification emails
const sendMarketListingNotification = async (batch, listingUser) => {
    try {
        // Get all users with type 'processor' or 'institution'
        const targetUsers = await User.find({
            type: { $in: ['processor', 'institution'] },
            email: { $exists: true, $ne: null }
        });

        if (targetUsers.length === 0) {
            console.log('No target users found for email notification');
            return;
        }

        // Create email content
        const emailSubject = `New Quality Grain Batch Available - ${batch.batchId}`;
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .batch-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                    .quality-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                    .quality-item { background: white; padding: 15px; border-radius: 6px; text-align: center; }
                    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                    .safety-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
                    .safe { background: #d4edda; color: #155724; }
                    .warning { background: #fff3cd; color: #856404; }
                    .danger { background: #f8d7da; color: #721c24; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌾 New Quality Grain Batch Available!</h1>
                        <p>A new batch has been listed on the marketplace</p>
                    </div>
                    
                    <div class="content">
                        <div class="batch-info">
                            <h2>Batch Details</h2>
                            <p><strong>Batch ID:</strong> ${batch.batchId}</p>
                            <p><strong>Supplier:</strong> ${batch.supplier}</p>
                            <p><strong>Listed by:</strong> ${listingUser}</p>
                            <p><strong>Available Quantity:</strong> ${batch.availableQuantity} kg</p>
                            <p><strong>Price:</strong> $${batch.pricePerKg}/kg</p>
                            <p><strong>Total Value:</strong> $${(batch.availableQuantity * batch.pricePerKg).toFixed(2)}</p>
                            
                            ${getSafetyBadge(batch.aflatoxin)}
                        </div>

                        <h3>Quality Metrics</h3>
                        <div class="quality-grid">
                            <div class="quality-item">
                                <strong>Moisture</strong><br>
                                ${batch.moisture_maize_grain}%
                            </div>
                            <div class="quality-item">
                                <strong>Aflatoxin</strong><br>
                                ${batch.aflatoxin} ppb
                            </div>
                            <div class="quality-item">
                                <strong>Broken Kernels</strong><br>
                                ${batch.broken_kernels_percent_maize_grain}%
                            </div>
                            <div class="quality-item">
                                <strong>Foreign Matter</strong><br>
                                ${batch.foreign_matter_percent_maize_grain}%
                            </div>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/marketplace" class="cta-button">
                                View on Marketplace
                            </a>
                        </div>

                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            This notification was sent because you are registered as a ${targetUsers[0]?.type} in our system. 
                            <br>Visit our marketplace to view all available batches and place orders.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send emails to all target users
        const emailPromises = targetUsers.map(user => {
            return transporter.sendMail({
                from: `"Grain Marketplace" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: emailSubject,
                html: emailHtml
            });
        });

        await Promise.all(emailPromises);
        console.log(`Notification emails sent to ${targetUsers.length} users`);

    } catch (error) {
        console.error('Error sending notification emails:', error);
        // Don't throw error to prevent batch listing from failing
    }
};

// Helper function to get safety badge HTML
const getSafetyBadge = (aflatoxin) => {
    const level = parseFloat(aflatoxin) || 0;
    
    if (level >= 0 && level <= 5) {
        return '<div class="safety-badge safe">✓ Safe for Children</div>';
    } else if (level > 5 && level <= 10) {
        return '<div class="safety-badge warning">⚠ Adults Only</div>';
    } else if (level > 10 && level <= 20) {
        return '<div class="safety-badge warning">🔶 Animal Feed Only</div>';
    } else {
        return '<div class="safety-badge danger">🚨 Not Safe for Use</div>';
    }
};

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
            aflatoxin: req.body.aflatoxin,
            // Marketplace fields (optional during creation)
            isOnMarket: req.body.isOnMarket || false,
            quantity: req.body.quantity || null,
            availableQuantity: req.body.quantity || null,
            pricePerKg: req.body.pricePerKg || null,
            marketListedAt: req.body.isOnMarket ? new Date() : null
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

        // Validate marketplace fields if being listed on market
        if (req.body.isOnMarket) {
            if (!req.body.quantity || req.body.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity is required and must be greater than 0 when listing on market'
                });
            }
            if (!req.body.pricePerKg || req.body.pricePerKg <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price per kg is required and must be greater than 0 when listing on market'
                });
            }
        }

        const newBatch = new Batch(batchData);
        const savedBatch = await newBatch.save();

        // Send email notifications if batch is listed on market during creation
        if (req.body.isOnMarket) {
            await sendMarketListingNotification(savedBatch, req.body.userName);
        }

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

// Put batch on market (ENHANCED WITH EMAIL NOTIFICATIONS)
const putBatchOnMarket = async (req, res) => {
    try {
        const batchId = req.params.id;
        const { quantity, pricePerKg } = req.body;

        // Validate required marketplace fields
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity is required and must be greater than 0'
            });
        }

        if (!pricePerKg || pricePerKg <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price per kg is required and must be greater than 0'
            });
        }

        const batch = await Batch.findById(batchId);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        // Check if batch is already on market
        if (batch.isOnMarket) {
            return res.status(400).json({
                success: false,
                message: 'Batch is already on the market'
            });
        }

        // Update batch with marketplace information
        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            {
                isOnMarket: true,
                quantity: quantity,
                availableQuantity: quantity,
                pricePerKg: pricePerKg,
                marketListedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        // Send email notifications to processors and institutions
        await sendMarketListingNotification(updatedBatch, batch.userName);

        res.status(200).json({
            success: true,
            message: 'Batch successfully listed on market and notifications sent',
            data: updatedBatch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error listing batch on market',
            error: error.message
        });
    }
};

// Remove batch from market
const removeBatchFromMarket = async (req, res) => {
    try {
        const batchId = req.params.id;

        const batch = await Batch.findById(batchId);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        if (!batch.isOnMarket) {
            return res.status(400).json({
                success: false,
                message: 'Batch is not currently on the market'
            });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            {
                isOnMarket: false,
                marketListedAt: null
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Batch removed from market',
            data: updatedBatch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing batch from market',
            error: error.message
        });
    }
};

// Get all available batches on market
const getMarketBatches = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            supplier, 
            minPrice, 
            maxPrice, 
            minQuantity,
            sortBy = 'marketListedAt',
            sortOrder = 'desc'
        } = req.query;
        
        let query = { isOnMarket: true, availableQuantity: { $gt: 0 } };
        
        // Add filters
        if (supplier) query.supplier = { $regex: supplier, $options: 'i' };
        if (minPrice) query.pricePerKg = { ...query.pricePerKg, $gte: parseFloat(minPrice) };
        if (maxPrice) query.pricePerKg = { ...query.pricePerKg, $lte: parseFloat(maxPrice) };
        if (minQuantity) query.availableQuantity = { ...query.availableQuantity, $gte: parseFloat(minQuantity) };

        // Create sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const batches = await Batch.find(query)
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v'); // Exclude version field

        const total = await Batch.countDocuments(query);

        res.status(200).json({
            success: true,
            data: batches,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching market batches',
            error: error.message
        });
    }
};

// Get market batch details by ID
const getMarketBatchById = async (req, res) => {
    try {
        const batch = await Batch.findOne({ 
            _id: req.params.id, 
            isOnMarket: true,
            availableQuantity: { $gt: 0 }
        });
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found on market or out of stock'
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching market batch',
            error: error.message
        });
    }
};

// Update batch quantity (for sales/purchases)
const updateBatchQuantity = async (req, res) => {
    try {
        const batchId = req.params.id;
        const { quantityPurchased, buyerUserId, buyerUserName } = req.body;

        if (!quantityPurchased || quantityPurchased <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity purchased must be greater than 0'
            });
        }

        const batch = await Batch.findById(batchId);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        if (!batch.isOnMarket) {
            return res.status(400).json({
                success: false,
                message: 'Batch is not available on market'
            });
        }

        if (batch.availableQuantity < quantityPurchased) {
            return res.status(400).json({
                success: false,
                message: `Insufficient quantity. Available: ${batch.availableQuantity}kg`
            });
        }

        const newAvailableQuantity = batch.availableQuantity - quantityPurchased;
        
        // Update available quantity
        const updateData = {
            availableQuantity: newAvailableQuantity
        };

        // If sold out, remove from market
        if (newAvailableQuantity === 0) {
            updateData.isOnMarket = false;
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: newAvailableQuantity === 0 ? 'Batch sold out and removed from market' : 'Quantity updated successfully',
            data: {
                batch: updatedBatch,
                purchaseDetails: {
                    quantityPurchased,
                    totalAmount: quantityPurchased * batch.pricePerKg,
                    remainingQuantity: newAvailableQuantity
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating batch quantity',
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
    // Original functions
    createBatch,
    getAllBatches,
    getBatchById,
    getBatchByBatchId,
    updateBatch,
    deleteBatch,
    getBatchesByUser,
    
    // New marketplace functions
    putBatchOnMarket,
    removeBatchFromMarket,
    getMarketBatches,
    getMarketBatchById,
    updateBatchQuantity
};