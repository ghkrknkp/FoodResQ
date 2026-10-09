const Claim = require('../models/Claim');
const FoodListing = require('../models/FoodListing');
const { createNotification } = require('../services/notificationService');
const { getIO, emitToUser, emitToRestaurant } = require('../services/socketService');

// @desc    Create claim for food listing
// @route   POST /api/food/:id/claims
// @access  Private (NGO, Volunteer only)
exports.createClaim = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const foodListingId = req.params.id;

    // Find food listing
    const foodListing = await FoodListing.findById(foodListingId).populate('providerId');

    if (!foodListing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    // Check if food is available
    if (foodListing.status === 'EXPIRED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot claim expired food',
      });
    }

    if (foodListing.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This listing has been cancelled',
      });
    }

    if (foodListing.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'This listing has been fully claimed',
      });
    }

    // Check if expired
    if (new Date() > foodListing.expiryTime) {
      return res.status(400).json({
        success: false,
        message: 'Food has expired',
      });
    }

    // Validate quantity
    if (quantity > foodListing.remainingQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${foodListing.remainingQuantity} ${foodListing.unit} available`,
      });
    }

    // Check for existing active claim by this user
    const existingClaim = await Claim.findOne({
      foodListingId,
      claimantId: req.user.id,
      status: { $in: ['CLAIMED', 'PICKUP_PENDING', 'COLLECTED'] },
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active claim for this listing',
      });
    }

    // Create claim
    const claim = await Claim.create({
      foodListingId,
      claimantId: req.user.id,
      quantity,
      status: 'CLAIMED',
    });

    // Update remaining quantity atomically
    const newRemainingQuantity = foodListing.remainingQuantity - quantity;
    
    // Update food listing status
    let newStatus = 'CLAIMED';
    if (newRemainingQuantity === 0) {
      newStatus = 'COMPLETED';
    }

    foodListing.remainingQuantity = newRemainingQuantity;
    foodListing.status = newStatus;
    await foodListing.save();

    // Populate claim details
    await claim.populate('claimantId', 'name email phone organizationName');
    await claim.populate('foodListingId', 'foodName quantity unit pickupLocation');

    // Create notification for restaurant
    await createNotification(
      foodListing.providerId._id,
      'Food Claimed',
      `${req.user.name} claimed ${quantity} ${foodListing.unit} of ${foodListing.foodName}`,
      'CLAIM'
    );

    // Emit socket event
    const io = getIO();
    if (io) {
      io.to(`user:${foodListing.providerId._id}`).emit('food:claimed', {
        foodListing,
        claim,
      });
    }

    // Notify restaurant of new claim via targeted helper
    emitToRestaurant(foodListing.providerId._id, 'claim:created', {
      claim,
      listing: foodListing,
    });

    res.status(201).json({
      success: true,
      message: 'Food claimed successfully',
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's claims
// @route   GET /api/claims
// @access  Private
exports.getMyClaims = async (req, res, next) => {
  try {
    const { status, sort = '-claimedAt' } = req.query;

    const query = { claimantId: req.user.id };

    if (status) {
      query.status = status;
    }

    const claims = await Claim.find(query)
      .populate('foodListingId', 'foodName category quantity unit pickupLocation pickupDeadline expiryTime providerId')
      .populate({
        path: 'foodListingId',
        populate: {
          path: 'providerId',
          select: 'name organizationName phone location',
        },
      })
      .sort(sort);

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single claim
// @route   GET /api/claims/:id
// @access  Private
exports.getClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('claimantId', 'name email phone organizationName')
      .populate('foodListingId')
      .populate({
        path: 'foodListingId',
        populate: {
          path: 'providerId',
          select: 'name organizationName phone location email',
        },
      });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Check authorization (claim owner or food provider)
    if (
      claim.claimantId._id.toString() !== req.user.id &&
      claim.foodListingId.providerId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this claim',
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim status
// @route   PUT /api/claims/:id
// @access  Private
exports.updateClaimStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let claim = await Claim.findById(req.params.id)
      .populate('claimantId', 'name')
      .populate('foodListingId', 'foodName providerId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Check if user owns the claim
    if (claim.claimantId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this claim',
      });
    }

    // Update status and timestamps
    claim.status = status;
    
    if (status === 'PICKUP_PENDING' && !claim.pickupAt) {
      claim.pickupAt = new Date();
    }
    
    if (status === 'COMPLETED' && !claim.completedAt) {
      claim.completedAt = new Date();
    }

    await claim.save();

    // Create notification for restaurant
    let notificationMessage = '';
    switch (status) {
      case 'PICKUP_PENDING':
        notificationMessage = `${claim.claimantId.name} is preparing to pick up ${claim.foodListingId.foodName}`;
        break;
      case 'COLLECTED':
        notificationMessage = `${claim.claimantId.name} collected ${claim.foodListingId.foodName}`;
        break;
      case 'COMPLETED':
        notificationMessage = `Claim for ${claim.foodListingId.foodName} has been completed`;
        break;
      case 'CANCELLED':
        notificationMessage = `${claim.claimantId.name} cancelled the claim for ${claim.foodListingId.foodName}`;
        break;
    }

    if (notificationMessage) {
      await createNotification(
        claim.foodListingId.providerId,
        'Claim Status Updated',
        notificationMessage,
        'STATUS_UPDATE'
      );
    }

    // Emit socket event
    const io = getIO();
    if (io) {
      io.to(`user:${claim.foodListingId.providerId}`).emit('claim:updated', claim);
      io.to(`user:${claim.claimantId._id}`).emit('claim:updated', claim);
    }

    // Notify claimant of status update via targeted helper
    emitToUser(claim.claimantId._id, 'claim:status_updated', {
      claimId: claim._id,
      status: claim.status,
    });

    res.status(200).json({
      success: true,
      message: 'Claim status updated successfully',
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claims for restaurant's listings
// @route   GET /api/claims/restaurant/all
// @access  Private (Restaurant only)
exports.getRestaurantClaims = async (req, res, next) => {
  try {
    // Find all food listings by this restaurant
    const foodListings = await FoodListing.find({ providerId: req.user.id }).select('_id');
    const foodListingIds = foodListings.map(listing => listing._id);

    // Find all claims for these listings
    const claims = await Claim.find({
      foodListingId: { $in: foodListingIds },
    })
      .populate('claimantId', 'name email phone organizationName')
      .populate('foodListingId', 'foodName category quantity unit pickupLocation')
      .sort('-claimedAt');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};
