const User = require('../models/User');
const FoodListing = require('../models/FoodListing');
const Claim = require('../models/Claim');

// @desc    Get restaurant dashboard analytics
// @route   GET /api/dashboard/restaurant
// @access  Private (Restaurant only)
exports.getRestaurantDashboard = async (req, res, next) => {
  try {
    const restaurantId = req.user.id;

    // Get all listings by this restaurant
    const allListings = await FoodListing.find({ providerId: restaurantId });
    const listingIds = allListings.map(l => l._id);

    // Get all claims for these listings
    const allClaims = await Claim.find({ foodListingId: { $in: listingIds } });

    // Calculate statistics
    const totalListings = allListings.length;
    const activeListings = allListings.filter(l => l.status === 'AVAILABLE').length;
    const claimedListings = allListings.filter(l => ['CLAIMED', 'PICKUP_PENDING', 'COLLECTED'].includes(l.status)).length;
    const completedListings = allListings.filter(l => l.status === 'COMPLETED').length;
    const expiredListings = allListings.filter(l => l.status === 'EXPIRED').length;

    // Calculate total food redistributed
    const completedClaims = allClaims.filter(c => c.status === 'COMPLETED');
    const foodRedistributed = completedClaims.reduce((sum, claim) => {
      const listing = allListings.find(l => l._id.toString() === claim.foodListingId.toString());
      return sum + (listing ? claim.quantity : 0);
    }, 0);

    // Get category distribution
    const categoryDistribution = allListings.reduce((acc, listing) => {
      acc[listing.category] = (acc[listing.category] || 0) + 1;
      return acc;
    }, {});

    // Get recent claims
    const recentClaims = await Claim.find({ foodListingId: { $in: listingIds } })
      .populate('claimantId', 'name organizationName')
      .populate('foodListingId', 'foodName quantity unit')
      .sort('-claimedAt')
      .limit(10);

    // Time series data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const listingsOverTime = await FoodListing.aggregate([
      {
        $match: {
          providerId: restaurantId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalListings,
          activeListings,
          claimedListings,
          completedListings,
          expiredListings,
          foodRedistributed,
        },
        categoryDistribution,
        recentClaims,
        listingsOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get NGO/Volunteer dashboard analytics
// @route   GET /api/dashboard/ngo
// @access  Private (NGO, Volunteer only)
exports.getNGODashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's claims
    const allClaims = await Claim.find({ claimantId: userId })
      .populate('foodListingId');

    // Calculate statistics
    const totalClaims = allClaims.length;
    const pendingPickups = allClaims.filter(c => ['CLAIMED', 'PICKUP_PENDING'].includes(c.status)).length;
    const completedClaims = allClaims.filter(c => c.status === 'COMPLETED').length;

    // Calculate total food collected
    const foodCollected = allClaims
      .filter(c => c.status === 'COMPLETED')
      .reduce((sum, claim) => sum + claim.quantity, 0);

    // Get available donations count
    const availableDonations = await FoodListing.countDocuments({
      status: 'AVAILABLE',
      expiryTime: { $gt: new Date() },
    });

    // Recent activity
    const recentClaims = await Claim.find({ claimantId: userId })
      .populate('foodListingId')
      .populate({
        path: 'foodListingId',
        populate: {
          path: 'providerId',
          select: 'name organizationName',
        },
      })
      .sort('-claimedAt')
      .limit(10);

    // Expiring soon food (next 24 hours)
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const expiringSoon = await FoodListing.find({
      status: 'AVAILABLE',
      expiryTime: { $gte: now, $lte: twentyFourHoursLater },
    })
      .populate('providerId', 'name organizationName location')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          availableDonations,
          totalClaims,
          pendingPickups,
          completedClaims,
          foodCollected,
        },
        recentClaims,
        expiringSoon,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const restaurants = await User.countDocuments({ role: 'RESTAURANT' });
    const ngos = await User.countDocuments({ role: 'NGO' });
    const volunteers = await User.countDocuments({ role: 'VOLUNTEER' });

    // Food listing statistics
    const totalListings = await FoodListing.countDocuments();
    const activeListings = await FoodListing.countDocuments({ status: 'AVAILABLE' });
    const completedListings = await FoodListing.countDocuments({ status: 'COMPLETED' });
    const expiredListings = await FoodListing.countDocuments({ status: 'EXPIRED' });

    // Claim statistics
    const totalClaims = await Claim.countDocuments();
    const completedClaims = await Claim.countDocuments({ status: 'COMPLETED' });

    // Calculate total food redistributed
    const completedClaimsData = await Claim.find({ status: 'COMPLETED' });
    const foodRedistributed = completedClaimsData.reduce((sum, claim) => sum + claim.quantity, 0);

    // Category distribution
    const categoryDistribution = await FoodListing.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Time series data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activityOverTime = await FoodListing.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          listings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const claimsOverTime = await Claim.aggregate([
      {
        $match: {
          claimedAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$claimedAt' } },
          claims: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top contributors (restaurants with most completed donations)
    const topContributors = await FoodListing.aggregate([
      {
        $match: { status: 'COMPLETED' },
      },
      {
        $group: {
          _id: '$providerId',
          completedDonations: { $sum: 1 },
        },
      },
      { $sort: { completedDonations: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'provider',
        },
      },
      {
        $unwind: '$provider',
      },
      {
        $project: {
          name: '$provider.name',
          organizationName: '$provider.organizationName',
          completedDonations: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          restaurants,
          ngos,
          volunteers,
        },
        listings: {
          total: totalListings,
          active: activeListings,
          completed: completedListings,
          expired: expiredListings,
        },
        claims: {
          total: totalClaims,
          completed: completedClaims,
        },
        impact: {
          foodRedistributed,
        },
        categoryDistribution,
        activityOverTime,
        claimsOverTime,
        topContributors,
      },
    });
  } catch (error) {
    next(error);
  }
};
