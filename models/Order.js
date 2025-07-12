// models/Order.js - CLEAN VERSION WITHOUT DUPLICATE INDEXES
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
        }
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    // Seller information
    sellerId: {
        type: String,
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    // Buyer information
    buyerId: {
        type: String,
        required: true
    },
    buyerName: {
        type: String,
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    buyerContact: {
        type: String
    },
    // Order details
    quantityOrdered: {
        type: Number,
        required: true,
        min: 0
    },
    pricePerKg: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    // Order status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'preparing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    // Timestamps
    orderDate: {
        type: Date,
        default: Date.now
    },
    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    // Additional information
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    notes: {
        type: String,
        maxlength: 500
    },
    sellerNotes: {
        type: String,
        maxlength: 500
    },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date }
}, {
    timestamps: true
});

// INDEXES - Only define each index ONCE!
orderSchema.index({ sellerId: 1, status: 1 });
orderSchema.index({ buyerId: 1 });
orderSchema.index({ batchId: 1 });
// Note: orderId already has unique: true above, so no need for separate index

// Ensure orderId is generated before saving
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        this.orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);