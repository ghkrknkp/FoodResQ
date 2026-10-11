const express = require('express');
const {
  getFoodListings,
  getFoodListing,
  createFoodListing,
  updateFoodListing,
  deleteFoodListing,
  getMyListings,
  uploadFoodImage,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getFoodListings);

// Protected routes (specific paths must come before /:id wildcard)
router.post('/upload-image', protect, authorize('RESTAURANT'), upload.single('image'), uploadFoodImage);
router.get('/my/listings', protect, authorize('RESTAURANT'), getMyListings);
router.post('/', protect, authorize('RESTAURANT'), createFoodListing);

// Wildcard param routes (must be last)
router.get('/:id', getFoodListing);
router.put('/:id', protect, authorize('RESTAURANT'), updateFoodListing);
router.delete('/:id', protect, authorize('RESTAURANT'), deleteFoodListing);

module.exports = router;
