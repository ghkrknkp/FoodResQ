const express = require('express');
const {
  getRestaurantDashboard,
  getNGODashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/restaurant', protect, authorize('RESTAURANT'), getRestaurantDashboard);
router.get('/ngo', protect, authorize('NGO', 'VOLUNTEER'), getNGODashboard);
router.get('/admin', protect, authorize('ADMIN'), getAdminDashboard);

module.exports = router;
