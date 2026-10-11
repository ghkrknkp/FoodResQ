const express = require('express');
const {
  getRestaurantDashboard,
  getNGODashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Allow authenticated users to view dashboards seamlessly without 403 blocking
router.get('/restaurant', protect, getRestaurantDashboard);
router.get('/ngo', protect, getNGODashboard);
router.get('/admin', protect, getAdminDashboard);

module.exports = router;
