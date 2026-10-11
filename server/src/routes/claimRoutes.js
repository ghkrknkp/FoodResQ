const express = require('express');
const {
  createClaim,
  getMyClaims,
  getClaim,
  updateClaimStatus,
  getRestaurantClaims,
} = require('../controllers/claimController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.post('/food/:id/claims', protect, authorize('NGO', 'VOLUNTEER'), createClaim);
router.get('/claims', protect, getMyClaims);
// Specific paths before /:id wildcard
router.get('/claims/restaurant/all', protect, authorize('RESTAURANT'), getRestaurantClaims);
router.get('/claims/:id', protect, getClaim);
router.put('/claims/:id', protect, updateClaimStatus);

module.exports = router;
