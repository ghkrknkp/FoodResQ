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
router.get('/:id', getFoodListing);

// Protected routes
router.post('/upload-image', protect, authorize('RESTAURANT'), upload.single('image'), uploadFoodImage);
router.post('/', protect, authorize('RESTAURANT'), createFoodListing);
router.put('/:id', protect, authorize('RESTAURANT'), updateFoodListing);
router.delete('/:id', protect, authorize('RESTAURANT'), deleteFoodListing);
router.get('/my/listings', protect, authorize('RESTAURANT'), getMyListings);

module.exports = router;
