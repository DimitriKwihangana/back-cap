const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  supplier: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  moisture_maize_grain: {
    type: Number,
    required: true
  },
  Immaturegrains: {
    type: Number,
    required: true
  },
  Discolored_grains: {
    type: Number,
    required: true
  },
  broken_kernels_percent_maize_grain: {
    type: Number,
    required: true
  },
  foreign_matter_percent_maize_grain: {
    type: Number,
    required: true
  },
  pest_damaged: {
    type: Number,
    required: true
  },
  rotten: {
    type: Number,
    required: true
  },
  Liveinfestation: {
    type: Number,
    required: true
  },
  abnormal_odours_maize_grain: {
    type: Number,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  aflatoxin: {
    type: Number,
    required: true
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch2', batchSchema);