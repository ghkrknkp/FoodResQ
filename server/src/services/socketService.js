const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io = null;

/**
 * Initialize Socket.IO
 */
exports.initializeSocket = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.role})`);

    // Join user-specific room
    socket.join(`user:${socket.user.id}`);

    // Join role-specific room
    socket.join(`role:${socket.user.role}`);

    // Restaurant users also join a restaurant-specific room
    if (socket.user.role === 'RESTAURANT') {
      socket.join(`restaurant:${socket.user.id}`);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('Socket.IO initialized');
  return io;
};

/**
 * Get Socket.IO instance
 */
exports.getIO = () => {
  if (!io) {
    console.warn('Socket.IO not initialized');
  }
  return io;
};

/**
 * Emit an event to a specific user's room
 */
exports.emitToUser = (userId, event, data) => {
  if (!io) {
    console.warn('Socket.IO not initialized');
    return;
  }
  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit an event to a specific restaurant's room
 */
exports.emitToRestaurant = (restaurantId, event, data) => {
  if (!io) {
    console.warn('Socket.IO not initialized');
    return;
  }
  io.to(`restaurant:${restaurantId}`).emit(event, data);
};
