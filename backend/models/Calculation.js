const mongoose = require('mongoose');

/**
 * Calculation Model - Data Encapsulation
 * Stores calculation history with relationships
 */
const calculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['dca', 'compound', 'retirement'],
    required: true
  },
  inputs: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  chartData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
calculationSchema.index({ userId: 1, createdAt: -1 });
calculationSchema.index({ userId: 1, type: 1 });

// Instance method - Get display name
calculationSchema.methods.getDisplayName = function() {
  const names = {
    dca: 'DCA Calculator',
    compound: 'Compound Interest',
    retirement: 'Retirement Planner'
  };
  return names[this.type] || 'Unknown';
};

// Static method - Get user calculations with pagination
calculationSchema.statics.getUserCalculations = function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static method - Get calculations by type
calculationSchema.statics.getByType = function(userId, type) {
  return this.find({ userId, type })
    .sort({ createdAt: -1 })
    .lean();
};

module.exports = mongoose.model('Calculation', calculationSchema);