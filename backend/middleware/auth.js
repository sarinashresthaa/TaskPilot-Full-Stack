 
// Authentication route definitions for login and user management
// Provides core functionality for the task management system
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log("🔑 Auth middleware - Headers:", req.headers);
    console.log("🔑 Auth middleware - Body:", req.body);

    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("🔑 Auth middleware - Extracted token:", token ? "[TOKEN_PRESENT]" : "[NO_TOKEN]");

    if (!token) {
      console.log("❌ Auth middleware - No token provided");
      return res.status(401).json({
        message: 'Authentication required. No token provided.',
        error: 'NO_TOKEN'
      });
    }

    console.log("🔑 Auth middleware - JWT_SECRET exists:", !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Auth middleware - Decoded token:", decoded);

    const user = await User.findById(decoded.userId).select('-password');
    console.log("🔑 Auth middleware - Found user:", user ? user.username : "NOT_FOUND");
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'User account is deactivated',
        error: 'ACCOUNT_DEACTIVATED' 
      });
    }


    user.lastLogin = new Date();
    await user.save();

    req.user = user;
    req.userId = user._id;
    req.token = token;

    console.log("✅ Auth middleware - Set req.user:", {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    });
    console.log("✅ Auth middleware - Set req.userId:", req.userId);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired',
        error: 'TOKEN_EXPIRED' 
      });
    }
    res.status(500).json({ 
      message: 'Authentication error',
      error: error.message 
    });
  }
};

module.exports = auth;