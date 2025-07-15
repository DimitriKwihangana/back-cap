const mongoose = require('mongoose');

// Define the Test Schema
const TestSchema = new mongoose.Schema({
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

  // User tracking
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  laboratoryEmail: {
    type: String,
    required: true,
  }

  // Add other fields for grain characteristics here if needed
});

// Export the model
module.exports = mongoose.model('Test', TestSchema);
