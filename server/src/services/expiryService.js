const cron = require('node-cron');
const FoodListing = require('../models/FoodListing');
const { notifyExpiryWarning } = require('./notificationService');
const { getIO } = require('./socketService');

/**
 * Check and update expired food listings
 */
exports.processExpiredListings = async () => {
  try {
    const now = new Date();

    // Find expired listings that are still marked as available
    const expiredListings = await FoodListing.find({
      expiryTime: { $lt: now },
      status: { $in: ['AVAILABLE', 'CLAIMED', 'PICKUP_PENDING'] },
    });

    if (expiredListings.length > 0) {
      console.log(`Processing ${expiredListings.length} expired listings...`);

      for (const listing of expiredListings) {
        listing.status = 'EXPIRED';
        await listing.save();

        // Emit socket event
        const io = getIO();
        if (io) {
          io.emit('food:expired', { id: listing._id });
          io.to(`user:${listing.providerId}`).emit('food:expired', listing);
        }
      }

      console.log(`Updated ${expiredListings.length} expired listings`);
    }
  } catch (error) {
    console.error('Error processing expired listings:', error);
  }
};

/**
 * Send expiry warnings for food expiring soon
 */
exports.sendExpiryWarnings = async () => {
  try {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find listings expiring within 24 hours that haven't been warned
    const expiringListings = await FoodListing.find({
      expiryTime: { $gte: now, $lte: twentyFourHoursLater },
      status: 'AVAILABLE',
      expiryWarningNotified: false,
    });

    if (expiringListings.length > 0) {
      console.log(`Sending expiry warnings for ${expiringListings.length} listings...`);

      for (const listing of expiringListings) {
        const hoursRemaining = Math.round((listing.expiryTime - now) / (1000 * 60 * 60));
        
        await notifyExpiryWarning(listing.providerId, listing, hoursRemaining);
        
        listing.expiryWarningNotified = true;
        await listing.save();
      }

      console.log(`Sent ${expiringListings.length} expiry warnings`);
    }
  } catch (error) {
    console.error('Error sending expiry warnings:', error);
  }
};

/**
 * Start expiry monitoring cron jobs
 */
exports.startExpiryMonitoring = () => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('Running expiry check...');
    await exports.processExpiredListings();
    await exports.sendExpiryWarnings();
  });

  console.log('Expiry monitoring started (runs every 15 minutes)');
  
  // Run immediately on startup
  exports.processExpiredListings();
  exports.sendExpiryWarnings();
};
