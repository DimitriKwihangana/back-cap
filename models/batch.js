const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    // Batch identification (EXISTING - unchanged)
    batchId: {
        type: String,
        required: true,
    },
    supplier: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    
    // User tracking (EXISTING - unchanged)
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    
    // Grain characteristics (EXISTING - unchanged)
    moisture_maize_grain: {
        type: String,
        required: true,
    },
    Immaturegrains: {
        type: String,
        required: true,
    },
    Discolored_grains: {
        type: String,
        required: true,
    },
    broken_kernels_percent_maize_grain: {
        type: String,
        required: true,
    },
    foreign_matter_percent_maize_grain: {
        type: String,
        required: true,
    },
    pest_damaged: {
        type: String,
        required: true,
    },
    rotten: {
        type: String,
        required: true,
    },
    Liveinfestation: {
        type: Number,
        required: true,
    },
    abnormal_odours_maize_grain: {
        type: Number,
        required: true,
    },
    aflatoxin: {
        type: String,
        required: true,
    },

    // NEW MARKETPLACE FIELDS ONLY
    isOnMarket: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        min: 0,
        default: null
    },
    availableQuantity: {
        type: Number,
        min: 0,
        default: null
    },
    pricePerKg: {
        type: Number,
        min: 0,
        default: null
    },
    marketListedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Batch', BatchSchema);