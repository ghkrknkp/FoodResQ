const jwt = require('jsonwebtoken');

const generateToken = (id, extra = {}) => {
  const secret = process.env.JWT_SECRET || 'foodresq-jwt-secret-key-2024';
  return jwt.sign({ id, ...extra }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;

