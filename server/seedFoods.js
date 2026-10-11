require('dotenv').config();
const mongoose = require('mongoose');
const FoodListing = require('./src/models/FoodListing');
const User = require('./src/models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    let restaurant = await User.findOne({ role: 'RESTAURANT' });
    if (!restaurant) {
      restaurant = await User.findOne({});
    }

    if (!restaurant) {
      console.error('No user found in database to associate listings with.');
      process.exit(1);
    }

    console.log(`Using restaurant user: ${restaurant.name} (${restaurant.email})`);

    await FoodListing.deleteMany({});
    console.log('Cleared existing food listings');

    const now = new Date();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const threeDays = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const listings = [
      // 1. TAMIL NADU KALYANA BIRYANI (USER UPLOADED BIRYANI)
      {
        providerId: restaurant._id,
        foodName: 'Tamil Nadu Kalyana Biryani | கல்யாண பிரியாணி (Dum Biryani)',
        category: 'Tamil Nadu Traditional',
        description: 'Authentic wedding feast Dum Biryani prepared with fragrant Seeraga Samba rice, whole spices, caramelized onions, fresh mint, and boiled eggs. Served with Ennai Kathirikai (brinjal curry) and onion raita.',
        quantity: 60,
        remainingQuantity: 60,
        unit: 'meals',
        image: '/uploads/tamil_biryani.jpg',
        pickupLocation: 'Mohanur Road, Namakkal, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 2. VAZHAI ILAI SAAPADU (USER UPLOADED THALI MEALS)
      {
        providerId: restaurant._id,
        foodName: 'Vazhai Ilai Saapadu | வாழை இலை சாப்பாடு (Traditional Tamil Meals)',
        category: 'Tamil Nadu Traditional',
        description: 'Full traditional meal with Ponni boiled rice, drumstick arachivitta sambar, pepper rasam, vegetable kootu, poriyal, crispy appalam, and payasam.',
        quantity: 50,
        remainingQuantity: 50,
        unit: 'meals',
        image: '/uploads/tamil_meals.jpg',
        pickupLocation: 'Paramathi Velur, Namakkal, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 3. SAMBAR SADHAM (USER UPLOADED SAMBAR RICE / THALI)
      {
        providerId: restaurant._id,
        foodName: 'Traditional Sambar Sadham | சாம்பார் சாதம் (Slow Cooked Sambar Rice)',
        category: 'Tamil Nadu Traditional',
        description: 'Flavorful slow-cooked sambar rice prepared with Ponni rice, toor dal, fresh vegetables, ghee, and roasted spices. Served with potato roast and appalam.',
        quantity: 45,
        remainingQuantity: 45,
        unit: 'meals',
        image: '/uploads/sambar_sadham.jpg',
        pickupLocation: 'Thillai Nagar, Tiruchirappalli (Trichy), Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 4. MADURAI MALLIPOO IDLI WITH SAMBAR
      {
        providerId: restaurant._id,
        foodName: 'Madurai Mallipoo Idli & Sambar | மதுரை மல்லிப்பூ இட்லி (Steamed Soft Idlis)',
        category: 'Tamil Nadu Traditional',
        description: 'Hot, fluffy steamed rice & urad dal idlis served with authentic Madurai shallot sambar, coconut chutney, and spicy tomato chutney.',
        quantity: 60,
        remainingQuantity: 60,
        unit: 'plates',
        image: '/uploads/idli.jpg',
        pickupLocation: 'Simmakkal, Madurai, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 5. CRISPY NEI ROAST DOSAI
      {
        providerId: restaurant._id,
        foodName: 'Crispy Nei Roast Dosa | நெய் ரோஸ்ட் தோசை (Ghee Roast with Sambar)',
        category: 'Tamil Nadu Traditional',
        description: 'Golden crispy fermented crepe roasted with pure ghee, served with piping hot sambar, coconut chutney, and tomato chutney.',
        quantity: 40,
        remainingQuantity: 40,
        unit: 'nos',
        image: '/uploads/dosa.jpg',
        pickupLocation: 'Gandhipuram, Coimbatore, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 6. GHEE VEN PONGAL & MEDU VADA (PONGAL PHOTO)
      {
        providerId: restaurant._id,
        foodName: 'Ghee Ven Pongal & Medu Vadai | வெண் பொங்கல் & மெது வடை',
        category: 'Tamil Nadu Traditional',
        description: 'Steaming hot Ven Pongal prepared with raw rice, yellow moong dal, crushed black pepper, cumin, cashews, and pure ghee. Served with crispy medu vadai and hot sambar.',
        quantity: 40,
        remainingQuantity: 40,
        unit: 'portions',
        image: '/uploads/pongal.jpg',
        pickupLocation: 'Mylapore, Chennai, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 7. MADURAI KOTHU PAROTTA (PAROTTA PHOTO)
      {
        providerId: restaurant._id,
        foodName: 'Madurai Kothu Parotta & Salna | மதுரை கொத்து பரோட்டா',
        category: 'Tamil Nadu Traditional',
        description: 'Flaky layered shredded parotta tossed on hot tawa with onions, green chillies, curry leaves, and spicy flavorful vegetable salna gravy.',
        quantity: 35,
        remainingQuantity: 35,
        unit: 'packs',
        image: '/uploads/parotta.jpg',
        pickupLocation: 'South Masi Street, Madurai, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 8. TRADITIONAL SUNDAL (USER UPLOADED SUNDAL / CHICKPEA IMAGE)
      {
        providerId: restaurant._id,
        foodName: 'Traditional Chana Sundal | வெள்ளை கொண்டைக்கடலை சுண்டல்',
        category: 'Tamil Nadu Traditional',
        description: 'Nutritious cooked white chickpeas (sundal) seasoned with mustard seeds, urad dal, curry leaves, asafoetida, and freshly grated coconut.',
        quantity: 35,
        remainingQuantity: 35,
        unit: 'packs',
        image: '/uploads/sundal.jpg',
        pickupLocation: 'Tirunelveli Junction, Tirunelveli, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 9. CRISPY APPALAM (USER UPLOADED APPALAM IMAGE)
      {
        providerId: restaurant._id,
        foodName: 'Crispy Appalam & Rice Vadams | மொறுமொறு அப்பளம் & வடம்',
        category: 'Other',
        description: 'Freshly fried crispy papadams and sun-dried rice vadams. Perfect crunchy accompaniment for sambar rice and traditional meals.',
        quantity: 30,
        remainingQuantity: 30,
        unit: 'packs',
        image: '/uploads/appalam.jpg',
        pickupLocation: 'Kallidaikurichi Center, Tirunelveli, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: threeDays,
        status: 'AVAILABLE'
      },

      // 10. SALEM FRESH FRUITS
      {
        providerId: restaurant._id,
        foodName: 'Salem Farm Fresh Fruit Baskets | சேலம் பழங்கள்',
        category: 'Fruits',
        description: 'Fresh hill bananas, sweet orchard fruits, and crisp apples harvested directly from local farmers in Tamil Nadu.',
        quantity: 30,
        remainingQuantity: 30,
        unit: 'kg',
        image: '/uploads/fresh_apples.jpg',
        pickupLocation: 'New Bus Stand Market, Salem, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 11. ERODE FARM FRESH VEGETABLES
      {
        providerId: restaurant._id,
        foodName: 'Erode Farmer Fresh Vegetables | ஈரோடு உழவர் சந்தை காய்கறிகள்',
        category: 'Vegetables',
        description: 'Farm-fresh drumsticks (murungakkai), country brinjals, green chillies, curry leaves, and fresh vegetables for cooking.',
        quantity: 25,
        remainingQuantity: 25,
        unit: 'kg',
        image: '/uploads/leafy_greens.jpg',
        pickupLocation: 'Perundurai Road, Erode, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: dayAfter,
        status: 'AVAILABLE'
      },

      // 12. THANJAVUR PONNI BOILED RICE
      {
        providerId: restaurant._id,
        foodName: 'Thanjavur Ponni Boiled Rice & Dal Kits | தஞ்சாவூர் பொன்னி அரிசி',
        category: 'Packaged Food',
        description: 'Hygienically packed 5kg Ponni boiled rice, unpolished toor dal, and sambar masala packs for community relief.',
        quantity: 50,
        remainingQuantity: 50,
        unit: 'kits',
        image: '/uploads/cereal_boxes.jpg',
        pickupLocation: 'Old Bus Stand, Thanjavur, Tamil Nadu',
        availableFrom: now,
        pickupDeadline: tomorrow,
        expiryTime: threeDays,
        status: 'AVAILABLE'
      }
    ];

    // Ensure staggered timestamps so order is preserved
    const baseTime = Date.now();
    listings.forEach((item, index) => {
      item.createdAt = new Date(baseTime + (listings.length - index) * 1000);
      item.updatedAt = item.createdAt;
    });

    const inserted = await FoodListing.insertMany(listings);
    console.log(`Successfully seeded ${inserted.length} listings with exact images and clean details!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding listings:', error);
    process.exit(1);
  }
}

seed();
