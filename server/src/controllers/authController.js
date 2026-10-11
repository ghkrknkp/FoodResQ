const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Helper to deduce role and display name from email
const deduceRole = (email = '', requestedRole = '') => {
  if (['RESTAURANT', 'NGO', 'VOLUNTEER', 'ADMIN'].includes(requestedRole)) {
    return requestedRole;
  }
  const em = (email || '').toLowerCase();
  if (em.includes('restaurant') || em.includes('cafe') || em.includes('hotel') || em.includes('food')) {
    return 'RESTAURANT';
  }
  if (em.includes('admin') || em.includes('manager')) {
    return 'ADMIN';
  }
  if (em.includes('volunteer') || em.includes('driver')) {
    return 'VOLUNTEER';
  }
  return 'NGO';
};

// @desc    Register user (or login if already exists)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, organizationName, phone, location } = req.body;
    const cleanEmail = (email || `user_${Date.now()}@foodresq.com`).trim().toLowerCase();
    const assignedRole = deduceRole(cleanEmail, role);
    const displayName = (name && name.trim()) || cleanEmail.split('@')[0] || 'FoodResQ Champion';
    const cleanPassword = (password && password.length >= 8) ? password : (password ? `${password}12345678` : 'Demo@1234');

    try {
      // If user already exists in DB, simply log them in smoothly
      let user = await User.findOne({ email: cleanEmail });
      if (user) {
        const token = generateToken(user._id, { role: user.role, email: user.email, name: user.name });
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Signed in successfully.',
          data: { user, token },
        });
      }

      // Create new user in DB
      user = await User.create({
        name: displayName,
        email: cleanEmail,
        password: cleanPassword,
        role: assignedRole,
        organizationName: organizationName || `${displayName} Team`,
        phone: phone || '+91 98765 43210',
        location: location || 'Chennai, Tamil Nadu',
      });

      const token = generateToken(user._id, { role: user.role, email: user.email, name: user.name });
      return res.status(201).json({
        success: true,
        message: 'Account created and signed in successfully',
        data: { user, token },
      });
    } catch (dbErr) {
      console.warn('DB register notice (using resilient fallback session):', dbErr.message);
      // Resilient fallback if MongoDB is down or schema validation has issue
      const fallbackUser = {
        _id: '650000000000000000000099',
        name: displayName,
        email: cleanEmail,
        role: assignedRole,
        organizationName: organizationName || `${displayName} Team`,
        phone: phone || '+91 98765 43210',
        location: location || 'Chennai, Tamil Nadu',
      };
      const token = generateToken(fallbackUser._id, { role: fallbackUser.role, email: fallbackUser.email, name: fallbackUser.name, user: fallbackUser });
      return res.status(201).json({
        success: true,
        message: 'Signed in successfully (Public Demo Mode)',
        data: { user: fallbackUser, token },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Any email and password works; auto-creates if new)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const cleanEmail = (email || 'demo.ngo@foodresq.com').trim().toLowerCase();
    const assignedRole = deduceRole(cleanEmail, role);
    const displayName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ') || 'FoodResQ User';

    try {
      // Find user (include password field)
      let user = await User.findOne({ email: cleanEmail }).select('+password');

      if (!user) {
        // Auto-create user on the fly so anyone can sign in with ANY email!
        user = await User.create({
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          email: cleanEmail,
          password: password && password.length >= 8 ? password : 'Demo@1234',
          role: assignedRole,
          organizationName: `${displayName} Org`,
          location: 'Chennai, Tamil Nadu',
          phone: '+91 98765 43210',
        });
      }

      const token = generateToken(user._id, { role: user.role, email: user.email, name: user.name });
      user.password = undefined;

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { user, token },
      });
    } catch (dbErr) {
      console.warn('DB login notice (using resilient fallback session):', dbErr.message);
      // Resilient fallback if MongoDB is disconnected or sleeping on Render
      const fallbackUser = {
        _id: '650000000000000000000088',
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: cleanEmail,
        role: assignedRole,
        organizationName: `${displayName} Organization`,
        location: 'Chennai, Tamil Nadu',
        phone: '+91 98765 43210',
      };
      const token = generateToken(fallbackUser._id, { role: fallbackUser.role, email: fallbackUser.email, name: fallbackUser.name, user: fallbackUser });
      return res.status(200).json({
        success: true,
        message: 'Login successful (Public Demo Mode)',
        data: { user: fallbackUser, token },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        success: true,
        data: {
          _id: '650000000000000000000001',
          name: 'FoodResQ Guest',
          email: 'guest@foodresq.com',
          role: 'NGO',
        },
      });
    }

    try {
      const user = await User.findById(req.user.id || req.user._id);
      if (user) {
        return res.status(200).json({
          success: true,
          data: user,
        });
      }
    } catch (e) {
      // DB lookup failed, return req.user from token
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
