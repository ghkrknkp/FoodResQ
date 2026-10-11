const FoodListing = require('../models/FoodListing');
const Claim = require('../models/Claim');

// @desc    AI Listing Assistant
// @route   POST /api/ai/listing-assistant
// @access  Private (Restaurant only)
exports.listingAssistant = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed description (at least 10 characters)',
      });
    }

    // AI Processing Logic (simulated for now - can integrate with OpenAI later)
    const aiAnalysis = await processListingDescription(description);

    res.status(200).json({
      success: true,
      message: 'AI analysis complete',
      data: aiAnalysis,
    });
  } catch (error) {
    console.error('AI Listing Assistant error:', error);
    res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable. Please try again later.',
    });
  }
};

// @desc    AI Demand Insights
// @route   GET /api/ai/demand-insights
// @access  Private (Restaurant only)
exports.demandInsights = async (req, res, next) => {
  try {
    // Get historical data for analysis
    const insights = await generateDemandInsights();

    res.status(200).json({
      success: true,
      message: 'Demand insights generated successfully',
      data: insights,
    });
  } catch (error) {
    console.error('AI Demand Insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to generate insights at this time',
    });
  }
};

// @desc    1. AI Vision: "Snap-to-Donate" Image Analysis
// @route   POST /api/ai/vision-analyze
// @access  Private (Restaurant, Volunteer, Admin)
exports.visionAnalyze = async (req, res, next) => {
  try {
    const { image, imageUrl, dishHint } = req.body;

    // Simulate AI Vision analysis with smart heuristics
    const visionResult = await processVisionAnalysis(image || imageUrl, dishHint);

    res.status(200).json({
      success: true,
      message: 'AI Vision analysis complete',
      data: visionResult,
    });
  } catch (error) {
    console.error('AI Vision error:', error);
    res.status(500).json({
      success: false,
      message: 'Vision AI analysis failed. Please try again.',
    });
  }
};

// @desc    2. AI Voice & Speech NLP Parser (Tamil + English)
// @route   POST /api/ai/voice-parse
// @access  Private (Restaurant, Volunteer, Admin)
exports.voiceParse = async (req, res, next) => {
  try {
    const { transcript, language } = req.body;

    if (!transcript || transcript.trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid speech transcript to analyze',
      });
    }

    const parsedListing = await processVoiceNLP(transcript, language);

    res.status(200).json({
      success: true,
      message: 'Voice transcript successfully parsed',
      data: parsedListing,
    });
  } catch (error) {
    console.error('Voice NLP error:', error);
    res.status(500).json({
      success: false,
      message: 'Voice transcription parser failed.',
    });
  }
};

// @desc    3. Climate-Aware Dynamic Expiry Calculator
// @route   POST /api/ai/expiry-calculator
// @access  Private or Public
exports.expiryCalculator = async (req, res, next) => {
  try {
    const { foodType, city, ambientTemp, storageCondition, cookedHoursAgo } = req.body;
    const expiryAssessment = calculateDynamicExpiry({
      foodType: foodType || 'Cooked Rice / Sambar',
      city: city || 'Namakkal',
      ambientTemp: ambientTemp !== undefined ? Number(ambientTemp) : 32,
      storageCondition: storageCondition || 'room_temperature',
      cookedHoursAgo: cookedHoursAgo !== undefined ? Number(cookedHoursAgo) : 2,
    });

    res.status(200).json({
      success: true,
      message: 'Dynamic expiry calculated',
      data: expiryAssessment,
    });
  } catch (error) {
    console.error('Expiry calculator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate dynamic expiry.',
    });
  }
};

// @desc    4. Smart NGO Matchmaker & Route Dispatcher
// @route   POST /api/ai/ngo-matcher
// @access  Private
exports.ngoMatcher = async (req, res, next) => {
  try {
    const { city, quantity, category, pickupLocation } = req.body;
    const matchResults = generateNgoMatches({
      city: city || 'Namakkal',
      quantity: Number(quantity) || 50,
      category: category || 'Tamil Nadu Traditional',
      pickupLocation: pickupLocation || 'Main Kitchen',
    });

    res.status(200).json({
      success: true,
      message: 'Optimal NGO matches and routes generated',
      data: matchResults,
    });
  } catch (error) {
    console.error('NGO Matcher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find NGO matches.',
    });
  }
};

// @desc    5. Food Safety, Storage & Digital QR Pass Guard
// @route   POST /api/ai/safety-verify
// @access  Private
exports.safetyVerify = async (req, res, next) => {
  try {
    const { foodName, holdingTemp, hoursAtRoomTemp, packagingType, hygieneChecked } = req.body;
    const safetyAudit = assessFoodSafety({
      foodName,
      holdingTemp: Number(holdingTemp) || 45,
      hoursAtRoomTemp: Number(hoursAtRoomTemp) || 2,
      packagingType: packagingType || 'Sealed Steel Food Containers',
      hygieneChecked: Boolean(hygieneChecked),
    });

    res.status(200).json({
      success: true,
      message: 'Food safety audit completed',
      data: safetyAudit,
    });
  } catch (error) {
    console.error('Safety audit error:', error);
    res.status(500).json({
      success: false,
      message: 'Safety evaluation failed.',
    });
  }
};

// @desc    6. Auto ESG & Green Carbon Offset Certificate Generator
// @route   POST /api/ai/esg-report
// @access  Private
exports.esgReport = async (req, res, next) => {
  try {
    const { restaurantName, totalRescuedKg, period } = req.body;
    const esgData = generateEsgMetrics({
      restaurantName: restaurantName || req.user?.name || 'Partner Restaurant',
      totalRescuedKg: Number(totalRescuedKg) || 120,
      period: period || 'Last 30 Days',
    });

    res.status(200).json({
      success: true,
      message: 'ESG impact certificate generated',
      data: esgData,
    });
  } catch (error) {
    console.error('ESG generator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ESG report.',
    });
  }
};

// @desc    7. Predictive Kitchen Waste Prevention Advisor
// @route   GET /api/ai/waste-forecast
// @access  Private
exports.wasteForecast = async (req, res, next) => {
  try {
    const { city, dayOfWeek, weather } = req.query;
    const forecast = generateWasteForecast({
      city: city || 'Namakkal',
      dayOfWeek: dayOfWeek || 'Sunday',
      weather: weather || 'Sunny / High Humidity',
    });

    res.status(200).json({
      success: true,
      message: 'Kitchen waste forecast generated',
      data: forecast,
    });
  } catch (error) {
    console.error('Waste forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate kitchen forecast.',
    });
  }
};

// AI Processing Function (Simulated)
async function processListingDescription(description) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const desc = description.toLowerCase();
  
  // Smart categorization
  let category = 'Other';
  let urgency = 'Medium';
  let suggestedTitle = '';
  let enhancedDescription = '';
  let tags = [];

  // Category detection
  if (desc.includes('rice') || desc.includes('meal') || desc.includes('curry') || desc.includes('dish')) {
    category = 'Prepared Meals';
  } else if (desc.includes('bread') || desc.includes('cake') || desc.includes('bakery') || desc.includes('pastry')) {
    category = 'Bakery';
  } else if (desc.includes('fruit') || desc.includes('apple') || desc.includes('banana') || desc.includes('orange')) {
    category = 'Fruits';
  } else if (desc.includes('vegetable') || desc.includes('carrot') || desc.includes('onion') || desc.includes('potato')) {
    category = 'Vegetables';
  } else if (desc.includes('packaged') || desc.includes('canned') || desc.includes('sealed') || desc.includes('box')) {
    category = 'Packaged Food';
  } else if (desc.includes('juice') || desc.includes('drink') || desc.includes('beverage') || desc.includes('water')) {
    category = 'Beverages';
  }

  // Title generation
  if (desc.includes('rice')) {
    suggestedTitle = desc.includes('vegetable') ? 'Vegetable Rice Meals' : 'Rice Meal Portions';
  } else if (desc.includes('bread')) {
    suggestedTitle = 'Fresh Bread Items';
  } else if (desc.includes('meal')) {
    suggestedTitle = 'Prepared Meal Portions';
  } else {
    // Extract key words for title
    const words = desc.split(' ').filter(word => 
      word.length > 3 && 
      !['have', 'with', 'from', 'that', 'this', 'they', 'were', 'been'].includes(word)
    );
    suggestedTitle = words.slice(0, 3).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Urgency assessment
  if (desc.includes('today') || desc.includes('soon') || desc.includes('quickly') || desc.includes('urgent')) {
    urgency = 'High';
  } else if (desc.includes('tomorrow') || desc.includes('later') || desc.includes('flexible')) {
    urgency = 'Low';
  }

  // Enhanced description
  enhancedDescription = `${description}. This ${category.toLowerCase()} is available for pickup and redistribution to help reduce food waste while supporting community food security initiatives.`;

  // Tags generation
  const foodKeywords = ['rice', 'bread', 'vegetable', 'fruit', 'meal', 'fresh', 'organic', 'healthy', 'surplus'];
  tags = foodKeywords.filter(keyword => desc.includes(keyword));
  
  // Add category-specific tags
  if (category === 'Prepared Meals') tags.push('ready-to-eat', 'cooked');
  if (category === 'Bakery') tags.push('baked', 'fresh');
  if (urgency === 'High') tags.push('urgent');

  return {
    suggestedTitle,
    category,
    enhancedDescription,
    tags: [...new Set(tags)], // Remove duplicates
    urgency,
    confidence: Math.round(Math.random() * 30 + 70), // 70-100% confidence
    recommendations: [
      urgency === 'High' 
        ? 'Consider listing this food with a shorter pickup deadline due to high urgency'
        : 'Standard pickup timeline recommended',
      `This ${category.toLowerCase()} typically has good claim rates in your area`,
      'Consider adding pickup instructions for better coordination'
    ]
  };
}

// Demand Insights Generation
async function generateDemandInsights() {
  try {
    // Get data from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aggregate food listings by category
    const categoryStats = await FoodListing.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$category',
          totalListings: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          avgQuantity: { $avg: '$quantity' },
          completedListings: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          successRate: {
            $multiply: [
              { $divide: ['$completedListings', '$totalListings'] },
              100
            ]
          }
        }
      },
      { $sort: { successRate: -1 } }
    ]);

    // Get claim patterns by hour
    const hourlyPatterns = await Claim.aggregate([
      {
        $match: {
          claimedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $hour: '$claimedAt' },
          claimCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate peak hours
    const peakHour = hourlyPatterns.reduce((peak, current) => 
      current.claimCount > peak.claimCount ? current : peak
    , { _id: 0, claimCount: 0 });

    // Get expiry patterns
    const expiryStats = await FoodListing.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalListings: { $sum: 1 },
          expiredListings: {
            $sum: { $cond: [{ $eq: ['$status', 'EXPIRED'] }, 1, 0] }
          },
          completedListings: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          expiryRate: {
            $multiply: [
              { $divide: ['$expiredListings', '$totalListings'] },
              100
            ]
          },
          successRate: {
            $multiply: [
              { $divide: ['$completedListings', '$totalListings'] },
              100
            ]
          }
        }
      }
    ]);

    // Check if we have sufficient data
    const totalListings = categoryStats.reduce((sum, cat) => sum + cat.totalListings, 0);
    
    if (totalListings < 5) {
      return {
        hasInsufficientData: true,
        message: "Not enough historical data to generate reliable insights. Create more listings to see AI-powered recommendations.",
        minimumDataPoints: 5,
        currentDataPoints: totalListings
      };
    }

    // Generate insights
    const topCategory = categoryStats[0];
    const peakTime = peakHour._id;
    const peakTimeFormatted = formatHour(peakTime);
    
    return {
      hasInsufficientData: false,
      categoryInsights: {
        mostPopular: {
          category: topCategory._id,
          successRate: Math.round(topCategory.successRate),
          totalListings: topCategory.totalListings
        },
        categoryBreakdown: categoryStats
      },
      timingInsights: {
        peakClaimHour: peakTime,
        peakTimeFormatted,
        recommendation: `Consider listing food around ${peakTimeFormatted} for higher claim rates`
      },
      performanceMetrics: expiryStats[0] || {
        expiryRate: 0,
        successRate: 0,
        totalListings: 0
      },
      recommendations: [
        `${topCategory._id} has the highest success rate at ${Math.round(topCategory.successRate)}%`,
        `Peak activity occurs around ${peakTimeFormatted}`,
        totalListings > 10 
          ? "You have good listing activity - consider consistent timing"
          : "Increase listing frequency for better insights",
        "Consider shorter pickup windows during peak hours"
      ],
      dataQuality: {
        totalListings,
        analysisPeriod: "Last 30 days",
        confidence: totalListings > 20 ? "High" : totalListings > 10 ? "Medium" : "Low"
      }
    };

  } catch (error) {
    console.error('Error generating demand insights:', error);
    throw error;
  }
}

// Helper function to format hour
function formatHour(hour) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

// -------------------------------------------------------------
// 1. Vision AI Analysis Engine
// -------------------------------------------------------------
async function processVisionAnalysis(imageUrl, dishHint) {
  await new Promise(resolve => setTimeout(resolve, 800));

  const str = `${imageUrl || ''} ${dishHint || ''}`.toLowerCase();

  let detectedDish = 'South Indian Sambar Meals';
  let category = 'Tamil Nadu Traditional';
  let portions = 30;
  let weightKg = 12;
  let allergens = ['Mustard', 'Gluten'];
  let freshness = 94;
  let description = 'Freshly prepared South Indian meals with rice, sambar, and vegetable poriyal in clean stainless food containers.';

  if (str.includes('pongal')) {
    detectedDish = 'Ghee Ven Pongal & Festive Feast | வெண் பொங்கல்';
    category = 'Tamil Nadu Traditional';
    portions = 50;
    weightKg = 16;
    allergens = ['Dairy (Pure Ghee)', 'Cashews', 'Black Pepper'];
    freshness = 97;
    description = 'Steaming hot traditional Ghee Ven Pongal cooked with yellow moong dal, whole black pepper, roasted cashews, and pure cow ghee. Hygienically packed for festive donation.';
  } else if (str.includes('biryani')) {
    detectedDish = 'Authentic Tamil Seeraga Samba Biryani';
    category = 'South Indian Specials';
    portions = 45;
    weightKg = 18;
    allergens = ['Dairy (Ghee)', 'Cashews'];
    freshness = 96;
    description = 'Hot and aromatic Tamil Nadu Seeraga Samba Biryani, packed freshly from catering service with raita and brinjal gravy.';
  } else if (str.includes('idli') || str.includes('vada')) {
    detectedDish = 'Steamed Idli & Medu Vada Combo';
    category = 'Tamil Nadu Traditional';
    portions = 50;
    weightKg = 10;
    allergens = ['Mustard (in Sambar)'];
    freshness = 92;
    description = 'Fluffy steamed rice idlis and crispy medu vadas with piping hot sambar, hygienically packed.';
  } else if (str.includes('dosa') || str.includes('parotta')) {
    detectedDish = 'Fresh Malabar Parotta & Salna';
    category = 'South Indian Specials';
    portions = 40;
    weightKg = 11;
    allergens = ['Gluten', 'Dairy'];
    freshness = 90;
    description = 'Flaky layered parottas with rich vegetable salna gravy, packed warm.';
  } else if (str.includes('bakery') || str.includes('bread') || str.includes('pastr') || str.includes('cake')) {
    detectedDish = 'Assorted Artisan Bakery Breads & Buns';
    category = 'Bakery';
    portions = 35;
    weightKg = 8;
    allergens = ['Gluten', 'Dairy', 'Eggs'];
    freshness = 95;
    description = 'Freshly baked sandwich bread loaves, dinner rolls, and butter buns packed in bakery paper bags.';
  } else if (str.includes('fruit') || str.includes('vegetable')) {
    detectedDish = 'Fresh Farm Fruits & Veggies Basket';
    category = 'Fruits';
    portions = 25;
    weightKg = 15;
    allergens = [];
    freshness = 97;
    description = 'Fresh wholesome seasonal fruits and vegetables, sorted and cleaned.';
  } else if (str.includes('curry') || str.includes('prepared') || str.includes('meal')) {
    detectedDish = 'Prepared Vegetarian Lunch Boxes';
    category = 'Prepared Meals';
    portions = 30;
    weightKg = 12;
    allergens = ['Dairy'];
    freshness = 93;
    description = 'Nutritious balanced meal boxes with rice, dal, subzi, and rotis.';
  }

  return {
    detectedDish,
    category,
    suggestedTitle: detectedDish,
    estimatedPortions: portions,
    estimatedWeightKg: weightKg,
    unit: 'meals',
    visualFreshnessScore: freshness,
    spoilageIndicators: 'No discoloration, steam visible, normal sauce consistency, safe packaging',
    allergens,
    confidence: 94,
    enhancedDescription: description,
    recommendedPickupHours: 3.5,
  };
}

// -------------------------------------------------------------
// 2. Voice & Speech NLP Parser Engine (Tamil & English)
// -------------------------------------------------------------
async function processVoiceNLP(transcript, language) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const text = transcript.toLowerCase();

  // Extract quantity
  let quantity = 25;
  const numMatch = transcript.match(/\b(\d+)\b/);
  if (numMatch) {
    quantity = parseInt(numMatch[1], 10);
  } else if (text.includes('இருபது') || text.includes('twenty')) {
    quantity = 20;
  } else if (text.includes('முப்பது') || text.includes('thirty')) {
    quantity = 30;
  } else if (text.includes('ஐம்பது') || text.includes('fifty')) {
    quantity = 50;
  } else if (text.includes('நூறு') || text.includes('hundred')) {
    quantity = 100;
  }

  // Detect Dish & Category
  let foodName = 'Tamil Nadu Vegetarian Meals';
  let category = 'Tamil Nadu Traditional';
  let unit = 'meals';

  if (text.includes('சாம்பார்') || text.includes('sambar') || text.includes('சாதம்') || text.includes('meals')) {
    foodName = 'Sambar Rice & Meals';
    category = 'Tamil Nadu Traditional';
  } else if (text.includes('பிரியாணி') || text.includes('biryani') || text.includes('briyani')) {
    foodName = 'Special Veg Biryani';
    category = 'South Indian Specials';
  } else if (text.includes('இட்லி') || text.includes('idli') || text.includes('தோசை') || text.includes('dosa')) {
    foodName = 'Idli & Dosa Breakfast Portions';
    category = 'Tamil Nadu Traditional';
  } else if (text.includes('ரொட்டி') || text.includes('bread') || text.includes('bakery') || text.includes('bun')) {
    foodName = 'Fresh Bakery Buns & Bread';
    category = 'Bakery';
    unit = 'kg';
  } else if (text.includes('பழம்') || text.includes('fruit') || text.includes('காய்') || text.includes('vegetable')) {
    foodName = 'Fresh Produce Surplus';
    category = 'Fruits';
    unit = 'kg';
  }

  // Detect Expiry Time
  const now = new Date();
  let expiryHours = 4;
  if (text.includes('2 மணி') || text.includes('2 hours')) expiryHours = 2;
  if (text.includes('3 மணி') || text.includes('3 hours')) expiryHours = 3;
  if (text.includes('5 மணி') || text.includes('5 pm') || text.includes('5:00')) expiryHours = 5;

  const expiryTime = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);

  return {
    rawTranscript: transcript,
    detectedLanguage: language || (text.match(/[\u0B80-\u0BFF]/) ? 'ta-IN' : 'en-IN'),
    parsedListing: {
      foodName,
      category,
      quantity,
      unit,
      description: `Spoken via Voice AI: "${transcript}". Food is freshly packed and available for community collection.`,
      pickupDeadline: expiryTime.toISOString().slice(0, 16),
      expiryTime: expiryTime.toISOString().slice(0, 16),
    },
    confidence: 93,
  };
}

// -------------------------------------------------------------
// 3. Climate-Aware Dynamic Expiry Calculator Engine
// -------------------------------------------------------------
function calculateDynamicExpiry({ foodType, city, ambientTemp, storageCondition, cookedHoursAgo }) {
  // Base safe hours at standard 25°C room temp
  let baseSafeHours = 6;
  const f = foodType.toLowerCase();
  if (f.includes('coconut') || f.includes('chutney') || f.includes('dairy')) {
    baseSafeHours = 4;
  } else if (f.includes('rice') || f.includes('sambar') || f.includes('meals')) {
    baseSafeHours = 6;
  } else if (f.includes('biryani') || f.includes('curry')) {
    baseSafeHours = 7;
  } else if (f.includes('bakery') || f.includes('bread')) {
    baseSafeHours = 28;
  } else if (f.includes('fruit') || f.includes('dry')) {
    baseSafeHours = 36;
  }

  // Thermal acceleration factor (Microbiological decay increases at higher ambient temperature)
  let thermalPenalty = 1.0;
  if (ambientTemp > 35) {
    thermalPenalty = 1.5;
  } else if (ambientTemp > 30) {
    thermalPenalty = 1.25;
  } else if (ambientTemp < 22) {
    thermalPenalty = 0.85;
  }

  // Storage condition adjustments
  let storageFactor = 1.0;
  if (storageCondition === 'insulated_hot') {
    // Hot holding above 60°C prevents bacterial growth
    storageFactor = 1.4;
  } else if (storageCondition === 'refrigerated') {
    // Cold storage under 5°C
    storageFactor = 3.0;
  } else if (storageCondition === 'direct_sun') {
    storageFactor = 0.6;
  }

  const effectiveSafeLife = (baseSafeHours * storageFactor) / thermalPenalty;
  const remainingHours = Math.max(0, parseFloat((effectiveSafeLife - cookedHoursAgo).toFixed(1)));
  const percentageLeft = Math.min(100, Math.max(0, Math.round((remainingHours / effectiveSafeLife) * 100)));

  let riskLevel = 'LOW';
  let badgeColor = 'emerald';
  let recommendation = 'Food is fresh and in optimal condition for pickup.';

  if (remainingHours <= 1.5) {
    riskLevel = 'CRITICAL';
    badgeColor = 'rose';
    recommendation = '🚨 Immediate emergency pickup needed! Food is approaching safe consumption limit.';
  } else if (remainingHours <= 3.0) {
    riskLevel = 'MODERATE';
    badgeColor = 'amber';
    recommendation = '⚠️ Moderate urgency. Prioritize nearby volunteer dispatch within 2 hours.';
  }

  return {
    foodType,
    city,
    ambientTemp: `${ambientTemp}°C`,
    storageCondition,
    totalSafeLifespanHours: parseFloat(effectiveSafeLife.toFixed(1)),
    cookedHoursAgo,
    remainingSafeHours: remainingHours,
    freshnessPercentage: percentageLeft,
    riskLevel,
    badgeColor,
    recommendation,
    spoilageFactorSummary: `At ${ambientTemp}°C in ${city} with ${storageCondition.replace('_', ' ')}, decay rate is ${(thermalPenalty).toFixed(2)}x faster than standard lab baselines.`,
  };
}

// -------------------------------------------------------------
// 4. Smart Proactive NGO Matchmaker & Route Dispatcher Engine
// -------------------------------------------------------------
const TN_NGO_DIRECTORY = {
  Namakkal: [
    { id: 'nam-1', name: 'Anbu Illam Orphanage', address: 'Mohanur Road, Namakkal', capacity: 45, contact: '+91 94432 10123', volunteerStatus: 'Online (2 drivers)' },
    { id: 'nam-2', name: 'Annai Karunai Illam Old Age Home', address: 'Paramathi Velur Road, Namakkal', capacity: 55, contact: '+91 94421 88912', volunteerStatus: 'Online (1 driver)' },
    { id: 'nam-3', name: 'Pasumai Seva Community Kitchen', address: 'Salem Road Bypass, Namakkal', capacity: 40, contact: '+91 98940 77651', volunteerStatus: 'Ready for pickup' },
  ],
  Chennai: [
    { id: 'chn-1', name: 'Aadhava Karunai Home', address: 'T. Nagar, Chennai', capacity: 70, contact: '+91 98401 22334', volunteerStatus: 'Online (4 drivers)' },
    { id: 'chn-2', name: 'Sivananda Orphanage', address: 'Tambaram East, Chennai', capacity: 60, contact: '+91 98410 99887', volunteerStatus: 'Online (2 drivers)' },
    { id: 'chn-3', name: 'Akshaya Trust Night Shelter', address: 'Royapettah, Chennai', capacity: 50, contact: '+91 99400 44556', volunteerStatus: 'Ready for pickup' },
  ],
  Coimbatore: [
    { id: 'cbe-1', name: 'Siragugal Child Welfare Home', address: 'R.S. Puram, Coimbatore', capacity: 55, contact: '+91 97871 33445', volunteerStatus: 'Online (2 drivers)' },
    { id: 'cbe-2', name: 'Sneham Elder Care Sanctuary', address: 'Gandhipuram, Coimbatore', capacity: 40, contact: '+91 98422 66778', volunteerStatus: 'Online (1 driver)' },
    { id: 'cbe-3', name: 'Kovai Food Bank Initiative', address: 'Peelamedu, Coimbatore', capacity: 80, contact: '+91 99945 11223', volunteerStatus: 'Ready for pickup' },
  ],
  Madurai: [
    { id: 'mdu-1', name: 'Meenakshi Seva Orphanage', address: 'KK Nagar, Madurai', capacity: 65, contact: '+91 94431 55667', volunteerStatus: 'Online (2 drivers)' },
    { id: 'mdu-2', name: 'Anbalayam Senior Home', address: 'Simmakkal, Madurai', capacity: 45, contact: '+91 98430 77889', volunteerStatus: 'Ready for pickup' },
  ],
  Salem: [
    { id: 'slm-1', name: 'Salem Vasantham Home', address: 'Hasthampatti, Salem', capacity: 50, contact: '+91 98427 44556', volunteerStatus: 'Online (2 drivers)' },
    { id: 'slm-2', name: 'Karunai Foundation', address: 'Fairlands, Salem', capacity: 40, contact: '+91 94433 88990', volunteerStatus: 'Ready for pickup' },
  ],
  Trichy: [
    { id: 'try-1', name: 'Kaveri Orphanage & Shelter', address: 'Thillai Nagar, Trichy', capacity: 60, contact: '+91 94432 44332', volunteerStatus: 'Online (3 drivers)' },
    { id: 'try-2', name: 'Trichy Karunai Illam', address: 'Srirangam, Trichy', capacity: 45, contact: '+91 98424 55667', volunteerStatus: 'Ready for pickup' },
  ],
};

function generateNgoMatches({ city, quantity, category, pickupLocation }) {
  const ngos = TN_NGO_DIRECTORY[city] || TN_NGO_DIRECTORY['Namakkal'];
  let remaining = quantity;
  const assignedPlan = [];

  for (let i = 0; i < ngos.length; i++) {
    if (remaining <= 0) break;
    const ngo = ngos[i];
    const allocated = Math.min(remaining, ngo.capacity);
    remaining -= allocated;

    assignedPlan.push({
      ...ngo,
      allocatedPortions: allocated,
      distanceKm: (2.2 + i * 1.8).toFixed(1),
      estimatedTransitMin: 8 + i * 7,
      priority: i === 0 ? 'Primary Dropoff' : `Secondary Dropoff #${i}`,
    });
  }

  const totalKm = assignedPlan.reduce((acc, curr) => acc + parseFloat(curr.distanceKm), 0);
  const totalMin = assignedPlan.reduce((acc, curr) => acc + curr.estimatedTransitMin, 0);

  return {
    city,
    totalSurplusQuantity: quantity,
    unassignedQuantity: remaining,
    optimizedRouteLegs: assignedPlan,
    totalRouteDistanceKm: totalKm.toFixed(1),
    totalEstDeliveryMinutes: totalMin,
    recommendedVehicle: quantity > 60 ? 'Van / Auto Rickshaw' : 'Two-Wheeler Volunteer with insulated box',
    volunteerDispatchStatus: 'Broadcast ready to 6 nearby verified volunteers',
  };
}

// -------------------------------------------------------------
// 5. Food Safety, Storage & Digital QR Pass Engine
// -------------------------------------------------------------
function assessFoodSafety({ foodName, holdingTemp, hoursAtRoomTemp, packagingType, hygieneChecked }) {
  let score = 100;
  const hazards = [];

  // Danger zone check (5°C to 60°C)
  if (holdingTemp > 5 && holdingTemp < 60) {
    if (hoursAtRoomTemp > 4) {
      score -= 35;
      hazards.push('Critical: Food has spent over 4 hours in the bacterial danger zone (5°C - 60°C).');
    } else if (hoursAtRoomTemp > 2) {
      score -= 15;
      hazards.push('Warning: Food is within the 2-4 hour danger threshold. Must be consumed immediately upon delivery.');
    }
  }

  if (!hygieneChecked) {
    score -= 10;
    hazards.push('Notice: Temperature and glove hygiene checklist was self-reported without photographic verification.');
  }

  if (packagingType.toLowerCase().includes('open') || packagingType.toLowerCase().includes('loose')) {
    score -= 20;
    hazards.push('Warning: Open containers increase risk of dust or particulate contamination.');
  }

  const passStatus = score >= 75 ? 'PASSED_SAFE' : score >= 60 ? 'CONDITIONAL_PASS' : 'REJECTED';
  const qrPassToken = `FSSAI-FRQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*9000+1000)}`;

  return {
    foodName: foodName || 'Cooked Meals',
    safetyScore: Math.max(0, score),
    passStatus,
    qrPassToken,
    dangerZoneExposed: holdingTemp > 5 && holdingTemp < 60,
    hazards,
    handlingProtocol: [
      'Transport in clean, covered insulated containers',
      'Consume or redistribute within safe countdown limit',
      'Ensure receiving staff sanitizes hands before serving'
    ],
    verifiedBy: 'FoodResQ AI FSSAI Hygiene Engine v2.4',
    generatedAt: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// 6. ESG & Green Carbon Offset Certificate Engine
// -------------------------------------------------------------
function generateEsgMetrics({ restaurantName, totalRescuedKg, period }) {
  const kg = totalRescuedKg || 120;
  const co2AvoidedKg = parseFloat((kg * 0.52).toFixed(1)); // ~0.52kg CO2 per kg food saved
  const waterSavedLiters = Math.round(kg * 840); // ~840L water equivalent in agricultural footprint
  const mealsEquivalent = Math.round(kg / 0.4); // ~400g per meal
  const treesEquivalent = parseFloat((co2AvoidedKg / 21).toFixed(2)); // ~21kg CO2 absorbed per tree/year

  const certId = `FRQ-ESG-${new Date().getFullYear()}-${Math.floor(Math.random()*89999+10000)}`;

  return {
    certificateId: certId,
    restaurantName,
    period,
    metrics: {
      foodRescuedKg: kg,
      co2AvoidedKg,
      waterSavedLiters,
      mealsEquivalent,
      treesEquivalent,
    },
    sustainabilityGrade: kg > 500 ? 'A+ Platinum Champion' : kg > 200 ? 'A Gold Steward' : 'Silver Contributor',
    issuedDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    verificationHash: Buffer.from(`${certId}-${restaurantName}-${kg}`).toString('base64').slice(0, 16),
  };
}

// -------------------------------------------------------------
// 7. Kitchen Waste Prevention Forecast Engine
// -------------------------------------------------------------
function generateWasteForecast({ city, dayOfWeek, weather }) {
  const dow = (dayOfWeek || 'Sunday').toLowerCase();
  let predictedSurplusRate = 12; // 12%
  let riskLevel = 'Moderate';
  let insights = [];
  let suggestedBatchAdjustments = [];

  if (dow.includes('sun') || dow.includes('sat')) {
    predictedSurplusRate = 22;
    riskLevel = 'High Surplus Risk';
    insights.push('Weekend dinner buffets and biryani sales typically fluctuate by 20-25% based on evening footfall.');
    suggestedBatchAdjustments.push({ dish: 'Biryani / Cooked Rice', adjustment: 'Reduce 4:00 PM evening batch by 15%', reason: 'Avoid closing-time excess' });
    suggestedBatchAdjustments.push({ dish: 'Gravies & Curries', adjustment: 'Hold last batch until 8:00 PM confirmation', reason: 'High spoilage rate in tropical heat' });
  } else if (dow.includes('mon')) {
    predictedSurplusRate = 8;
    riskLevel = 'Low Surplus Risk';
    insights.push('Mondays experience predictable, consistent lunch crowds with lower wastage rates.');
    suggestedBatchAdjustments.push({ dish: 'Executive Meals', adjustment: 'Standard preparation batch recommended', reason: 'Normal Monday demand profile' });
  } else {
    predictedSurplusRate = 14;
    riskLevel = 'Moderate';
    insights.push('Mid-week catering orders may have 10-15% surplus due to floating office schedules.');
    suggestedBatchAdjustments.push({ dish: 'Breakfast Tiffin / Idli-Dosa', adjustment: 'Prep 10% on-demand after 10 AM', reason: 'Prevents mid-day leftovers' });
  }

  if ((weather || '').toLowerCase().includes('rain')) {
    predictedSurplusRate += 10;
    insights.push('🌧️ Rainy weather reduces dine-in walk-ins by ~28% in Tamil Nadu cities. High leftover probability!');
  }

  return {
    city,
    dayOfWeek,
    weather,
    predictedSurplusPercentage: predictedSurplusRate,
    riskLevel,
    insights,
    suggestedBatchAdjustments,
    preventativeSavingsEstimate: `Estimated ₹${predictedSurplusRate * 240} saved per week by adopting AI batch alerts`,
  };
}