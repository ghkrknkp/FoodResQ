const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  foodListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodListing',
    required: true,
  },
  claimantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  status: {
    type: String,
    enum: ['CLAIMED', 'PICKUP_PENDING', 'COLLECTED', 'COMPLETED', 'CANCELLED'],
    default: 'CLAIMED',
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
  pickupAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for performance
claimSchema.index({ foodListingId: 1 });
claimSchema.index({ claimantId: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ claimedAt: -1 });

module.exports = mongoose.model('Claim', claimSchema);
