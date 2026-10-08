const Notification = require('../models/Notification');
const { getIO } = require('./socketService');

/**
 * Create a notification
 */
exports.createNotification = async (userId, title, message, type = 'GENERAL') => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    // Emit socket event
    const io = getIO();
    if (io) {
      io.to(`user:${userId}`).emit('notification:new', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Notify restaurant that their food was claimed
 */
exports.notifyFoodClaimed = async (restaurantId, foodListing, claim) => {
  const title = 'Food Claimed';
  const message = `Your ${foodListing.foodName} listing was claimed for ${claim.quantity} ${foodListing.unit}`;
  return await exports.createNotification(restaurantId, title, message, 'CLAIM');
};

/**
 * Notify claimant about status update
 */
exports.notifyClaimUpdated = async (claimantId, claim, newStatus) => {
  const title = 'Claim Status Updated';
  let message = '';
  
  switch (newStatus) {
    case 'PICKUP_PENDING':
      message = 'Your claim is ready for pickup';
      break;
    case 'COLLECTED':
      message = 'Food has been marked as collected';
      break;
    case 'COMPLETED':
      message = 'Your claim has been completed';
      break;
    case 'CANCELLED':
      message = 'Your claim has been cancelled';
      break;
    default:
      message = `Your claim status has been updated to ${newStatus}`;
  }
  
  return await exports.createNotification(claimantId, title, message, 'STATUS_UPDATE');
};

/**
 * Notify restaurant about expiring food
 */
exports.notifyExpiryWarning = async (restaurantId, foodListing, hoursRemaining) => {
  const title = 'Food Expiring Soon';
  const message = `Your ${foodListing.foodName} listing will expire in ${hoursRemaining} hours`;
  return await exports.createNotification(restaurantId, title, message, 'EXPIRY_WARNING');
};
