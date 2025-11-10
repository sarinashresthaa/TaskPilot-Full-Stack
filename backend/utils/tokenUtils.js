 
// JWT token utility functions for authentication operations
// Provides core functionality for the task management system
const jwt = require("jsonwebtoken");

const generateToken = (userId, expiresIn = "7d") => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  );
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
