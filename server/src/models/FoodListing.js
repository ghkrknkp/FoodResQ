const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Prepared Meals',
      'Bakery',
      'Fruits',
      'Vegetables',
      'Packaged Food',
      'Beverages',
      'Other'
    ],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  remainingQuantity: {
    type: Number,
    required: true,
    min: [0, 'Remaining quantity cannot be negative'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true,
  },
  availableFrom: {
    type: Date,
    required: [true, 'Available from date is required'],
  },
  pickupDeadline: {
    type: Date,
    required: [true, 'Pickup deadline is required'],
  },
  expiryTime: {
    type: Date,
    required: [true, 'Expiry time is required'],
  },
  status: {
    type: String,
    enum: [
      'AVAILABLE',
      'CLAIMED',
      'PICKUP_PENDING',
      'COLLECTED',
      'COMPLETED',
      'CANCELLED',
      'EXPIRED'
    ],
    default: 'AVAILABLE',
  },
  expiryWarningNot ified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for performance
foodListingSchema.index({ providerId: 1 });
foodListingSchema.index({ status: 1 });
foodListingSchema.index({ category: 1 });
foodListingSchema.index({ expiryTime: 1 });
foodListingSchema.index({ pickupLocation: 1 });
foodListingSchema.index({ createdAt: -1 });

// Set remainingQuantity to quantity by default
foodListingSchema.pre('save', function (next) {
  if (this.isNew && !this.remainingQuantity) {
    this.remainingQuantity = this.quantity;
  }
  next();
});

// Virtual for checking if expiring soon
foodListingSchema.virtual('isExpiringSoon').get(function () {
  const now = new Date();
  const hoursUntilExpiry = (this.expiryTime - now) / (1000 * 60 * 60);
  return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
});

// Virtual for checking if expired
foodListingSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiryTime;
});

// Ensure virtuals are included in JSON
foodListingSchema.set('toJSON', { virtuals: true });
foodListingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('FoodListing', foodListingSchema);
