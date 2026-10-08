const FoodListing = require('../models/FoodListing');
const { getIO } = require('../services/socketService');

// @desc    Get all food listings with filters
// @route   GET /api/food
// @access  Public
exports.getFoodListings = async (req, res, next) => {
  try {
    const {
      category,
      location,
      search,
      status,
      sort = '-createdAt',
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location (case-insensitive partial match)
    if (location) {
      query.pickupLocation = { $regex: location, $options: 'i' };
    }

    // Search by food name or description
    if (search) {
      query.$or = [
        { foodName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status (default to AVAILABLE)
    if (status) {
      query.status = status;
    } else {
      query.status = 'AVAILABLE';
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const foodListings = await FoodListing.find(query)
      .populate('providerId', 'name organizationName location phone')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await FoodListing.countDocuments(query);

    res.status(200).json({
      success: true,
      count: foodListings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: foodListings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food listing
// @route   GET /api/food/:id
// @access  Public
exports.getFoodListing = async (req, res, next) => {
  try {
    const foodListing = await FoodListing.findById(req.params.id)
      .populate('providerId', 'name organizationName location phone email');

    if (!foodListing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: foodListing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create food listing
// @route   POST /api/food
// @access  Private (Restaurant only)
exports.createFoodListing = async (req, res, next) => {
  try {
    // Add provider ID from logged-in user
    req.body.providerId = req.user.id;

    // Validate dates
    const { availableFrom, pickupDeadline, expiryTime } = req.body;
    
    if (new Date(pickupDeadline) > new Date(expiryTime)) {
      return res.status(400).json({
        success: false,
        message: 'Pickup deadline must be before expiry time',
      });
    }

    if (new Date(expiryTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Expiry time cannot be in the past',
      });
    }

    const foodListing = await FoodListing.create(req.body);

    // Populate provider details
    await foodListing.populate('providerId', 'name organizationName location');

    // Emit socket event
    const io = getIO();
    if (io) {
      io.emit('food:created', foodListing);
    }

    res.status(201).json({
      success: true,
      message: 'Food listing created successfully',
      data: foodListing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food listing
// @route   PUT /api/food/:id
// @access  Private (Restaurant - own listings only)
exports.updateFoodListing = async (req, res, next) => {
  try {
    let foodListing = await FoodListing.findById(req.params.id);

    if (!foodListing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    // Check if user owns the listing
    if (foodListing.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    // Don't allow updating if listing is claimed
    if (foodListing.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update listing that has been claimed',
      });
    }

    // Validate dates if provided
    const { pickupDeadline, expiryTime } = req.body;
    if (pickupDeadline && expiryTime) {
      if (new Date(pickupDeadline) > new Date(expiryTime)) {
        return res.status(400).json({
          success: false,
          message: 'Pickup deadline must be before expiry time',
        });
      }
    }

    foodListing = await FoodListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('providerId', 'name organizationName location');

    // Emit socket event
    const io = getIO();
    if (io) {
      io.emit('food:updated', foodListing);
    }

    res.status(200).json({
      success: true,
      message: 'Food listing updated successfully',
      data: foodListing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food listing
// @route   DELETE /api/food/:id
// @access  Private (Restaurant - own listings only)
exports.deleteFoodListing = async (req, res, next) => {
  try {
    const foodListing = await FoodListing.findById(req.params.id);

    if (!foodListing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    // Check if user owns the listing
    if (foodListing.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    // Don't allow deleting if listing is claimed
    if (foodListing.status !== 'AVAILABLE' && foodListing.status !== 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete listing that has been claimed',
      });
    }

    await foodListing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food listing deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant's own listings
// @route   GET /api/food/my-listings
// @access  Private (Restaurant only)
exports.getMyListings = async (req, res, next) => {
  try {
    const { status, sort = '-createdAt' } = req.query;

    const query = { providerId: req.user.id };

    if (status) {
      query.status = status;
    }

    const listings = await FoodListing.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};
