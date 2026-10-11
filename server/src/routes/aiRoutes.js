const express = require('express');
const {
  listingAssistant,
  demandInsights,
  visionAnalyze,
  voiceParse,
  expiryCalculator,
  ngoMatcher,
  safetyVerify,
  esgReport,
  wasteForecast,
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Existing AI endpoints
router.post('/listing-assistant', protect, authorize('RESTAURANT', 'ADMIN'), listingAssistant);
router.get('/demand-insights', protect, authorize('RESTAURANT', 'ADMIN'), demandInsights);

// 1. Vision AI: Snap-to-Donate
router.post('/vision-analyze', protect, visionAnalyze);

// 2. Voice & Speech NLP Parser (Tamil + English)
router.post('/voice-parse', protect, voiceParse);

// 3. Climate-Aware Dynamic Expiry Calculator
router.post('/expiry-calculator', expiryCalculator);

// 4. Smart Proactive NGO Matchmaker & Route Dispatcher
router.post('/ngo-matcher', ngoMatcher);

// 5. Food Safety & Digital QR Pass Guard
router.post('/safety-verify', safetyVerify);

// 6. ESG & Carbon Offset Impact Certificate
router.post('/esg-report', esgReport);

// 7. Kitchen Waste Prevention Forecast
router.get('/waste-forecast', wasteForecast);

module.exports = router;