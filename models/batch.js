const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    // Batch identification
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
    
    // User tracking (now passed in request body)
    userId: {
        type: String, // Changed from ObjectId to String since user will pass it
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    
    // Grain characteristics
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
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Batch', BatchSchema);