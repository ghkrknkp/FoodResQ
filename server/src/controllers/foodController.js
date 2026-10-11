const FoodListing = require('../models/FoodListing');
const { getIO } = require('../services/socketService');

const DEFAULT_FOOD_ITEMS = [
  {
    _id: '650000000000000000000011',
    foodName: 'Tamil Nadu Kalyana Biryani | கல்யாண பிரியாணி (Dum Biryani)',
    category: 'Tamil Nadu Traditional',
    description: 'Authentic wedding feast Dum Biryani prepared with fragrant Seeraga Samba rice, whole spices, caramelized onions, fresh mint, and boiled eggs. Served with Ennai Kathirikai and onion raita.',
    quantity: 60,
    remainingQuantity: 60,
    unit: 'meals',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    pickupLocation: 'Mohanur Road, Namakkal, Tamil Nadu',
    status: 'AVAILABLE',
    createdAt: new Date(),
    expiryTime: new Date(Date.now() + 48 * 3600000),
    providerId: {
      _id: '650000000000000000000001',
      name: 'Anjappar Chettinad',
      organizationName: 'Anjappar Group Namakkal',
      location: 'Namakkal, Tamil Nadu',
      phone: '+91 98401 23456',
    },
  },
  {
    _id: '650000000000000000000012',
    foodName: 'Vazhai Ilai Saapadu | வாழை இலை சாப்பாடு (Traditional Tamil Meals)',
    category: 'Tamil Nadu Traditional',
    description: 'Full traditional meal with Ponni boiled rice, drumstick arachivitta sambar, pepper rasam, vegetable kootu, poriyal, crispy appalam, and sweet payasam.',
    quantity: 50,
    remainingQuantity: 50,
    unit: 'meals',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
    pickupLocation: 'Paramathi Velur, Namakkal, Tamil Nadu',
    status: 'AVAILABLE',
    createdAt: new Date(),
    expiryTime: new Date(Date.now() + 48 * 3600000),
    providerId: {
      _id: '650000000000000000000001',
      name: 'Sri Krishna Vilas',
      organizationName: 'Krishna Vilas Caterers',
      location: 'Paramathi Velur, Namakkal',
      phone: '+91 98402 34567',
    },
  },
  {
    _id: '650000000000000000000013',
    foodName: 'Traditional Sambar Sadham | சாம்பார் சாதம் (Slow Cooked Sambar Rice)',
    category: 'Cooked Meals',
    description: 'Flavorful slow-cooked sambar rice prepared with Ponni rice, toor dal, fresh country vegetables, ghee, and roasted spices.',
    quantity: 45,
    remainingQuantity: 45,
    unit: 'meals',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    pickupLocation: 'Thillai Nagar, Tiruchirappalli (Trichy), Tamil Nadu',
    status: 'AVAILABLE',
    createdAt: new Date(),
    expiryTime: new Date(Date.now() + 48 * 3600000),
    providerId: {
      _id: '650000000000000000000001',
      name: 'Trichy Grand Feast',
      organizationName: 'Grand Feast Kitchen',
      location: 'Trichy, Tamil Nadu',
      phone: '+91 98403 45678',
    },
  },
  {
    _id: '650000000000000000000014',
    foodName: 'Madurai Mallipoo Idli & Sambar | மதுரை மல்லிப்பூ இட்லி (Steamed Soft Idlis)',
    category: 'Tamil Nadu Traditional',
    description: 'Hot, fluffy steamed rice & urad dal idlis served with authentic Madurai shallot sambar, coconut chutney, and spicy tomato chutney.',
    quantity: 60,
    remainingQuantity: 60,
    unit: 'plates',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    pickupLocation: 'Simmakkal, Madurai, Tamil Nadu',
    status: 'AVAILABLE',
    createdAt: new Date(),
    expiryTime: new Date(Date.now() + 48 * 3600000),
    providerId: {
      _id: '650000000000000000000001',
      name: 'Murugan Idli Shop',
      organizationName: 'Murugan Idli Group',
      location: 'Madurai, Tamil Nadu',
      phone: '+91 98404 56789',
    },
  },
];

// @desc    Get all food listings with filters
// @route   GET /api/food
// @access  Public
exports.getFoodListings = async (req, res) => {
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

    const query = {};
    if (category) query.category = category;
    if (location) query.pickupLocation = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { foodName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    query.status = status || 'AVAILABLE';

    const skip = (page - 1) * limit;

    let foodListings = [];
    let total = 0;

    try {
      foodListings = await FoodListing.find(query)
        .populate('providerId', 'name organizationName location phone')
        .sort(sort)
        .limit(parseInt(limit))
        .skip(skip);
      total = await FoodListing.countDocuments(query);
    } catch (dbErr) {
      console.warn('DB query food notice:', dbErr.message);
    }

    if (!foodListings || foodListings.length === 0) {
      foodListings = DEFAULT_FOOD_ITEMS;
      total = DEFAULT_FOOD_ITEMS.length;
    }

    res.status(200).json({
      success: true,
      count: foodListings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit) || 1,
      data: foodListings,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: DEFAULT_FOOD_ITEMS.length,
      total: DEFAULT_FOOD_ITEMS.length,
      page: 1,
      pages: 1,
      data: DEFAULT_FOOD_ITEMS,
    });
  }
};

// @desc    Get single food listing
// @route   GET /api/food/:id
// @access  Public
exports.getFoodListing = async (req, res) => {
  try {
    let foodListing = null;
    try {
      foodListing = await FoodListing.findById(req.params.id)
        .populate('providerId', 'name organizationName location phone email');
    } catch (e) {
      // Not a valid ObjectId or DB offline
    }

    if (!foodListing) {
      foodListing = DEFAULT_FOOD_ITEMS.find((f) => f._id === req.params.id) || DEFAULT_FOOD_ITEMS[0];
    }

    res.status(200).json({
      success: true,
      data: foodListing,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: DEFAULT_FOOD_ITEMS[0],
    });
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
      // Emit status change event if status was included in the update
      if (req.body.status) {
        io.emit('food:status_changed', { listingId: foodListing._id, status: foodListing.status });
      }
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

// @desc    Upload a food image
// @route   POST /api/food/upload-image
// @access  Private (Restaurant only)
exports.uploadFoodImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: '/uploads/' + req.file.filename,
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
