/**
 * Demo Seed Script — FoodResQ
 * Creates 4 demo accounts for public testing:
 *   Restaurant: demo.restaurant@foodresq.com / Demo@1234
 *   NGO:        demo.ngo@foodresq.com        / Demo@1234
 *   Volunteer:  demo.volunteer@foodresq.com  / Demo@1234
 *   Admin:      demo.admin@foodresq.com      / Demo@1234
 *
 * Run: node server/seedDemo.js
 */

require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DEMO_USERS = [
  {
    name: 'Demo Restaurant',
    email: 'demo.restaurant@foodresq.com',
    password: 'Demo@1234',
    role: 'RESTAURANT',
    organizationName: 'FoodResQ Demo Hotel',
    phone: '9876543210',
    location: 'Namakkal, Tamil Nadu',
  },
  {
    name: 'Demo NGO',
    email: 'demo.ngo@foodresq.com',
    password: 'Demo@1234',
    role: 'NGO',
    organizationName: 'Hope Foundation NGO',
    phone: '9876543211',
    location: 'Salem, Tamil Nadu',
  },
  {
    name: 'Demo Volunteer',
    email: 'demo.volunteer@foodresq.com',
    password: 'Demo@1234',
    role: 'VOLUNTEER',
    organizationName: 'FoodResQ Volunteers',
    phone: '9876543212',
    location: 'Chennai, Tamil Nadu',
  },
  {
    name: 'Demo Admin',
    email: 'demo.admin@foodresq.com',
    password: 'Demo@1234',
    role: 'ADMIN',
    organizationName: 'FoodResQ Platform',
    phone: '9876543213',
    location: 'Tamil Nadu',
  },
];

async function seedDemo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Define inline schema to avoid circular dep issues
    const { Schema } = mongoose;
    let User;
    try {
      User = mongoose.model('User');
    } catch {
      const userSchema = new Schema({
        name: String,
        email: { type: String, unique: true, lowercase: true },
        password: { type: String, select: false },
        role: String,
        organizationName: String,
        phone: String,
        location: String,
        createdAt: { type: Date, default: Date.now },
      });
      userSchema.pre('save', async function (next) {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      });
      User = mongoose.model('User', userSchema);
    }

    for (const demo of DEMO_USERS) {
      const exists = await User.findOne({ email: demo.email });
      if (exists) {
        console.log(`⚠️  Already exists: ${demo.email}`);
        continue;
      }
      await User.create(demo);
      console.log(`✅ Created: ${demo.email} [${demo.role}]`);
    }

    console.log('\n🎉 Demo accounts ready!');
    console.log('─────────────────────────────────────────');
    console.log('Email                         | Password');
    console.log('─────────────────────────────────────────');
    DEMO_USERS.forEach(u => {
      console.log(`${u.email.padEnd(30)} | ${u.password}`);
    });
    console.log('─────────────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedDemo();
