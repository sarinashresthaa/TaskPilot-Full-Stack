 
// Async error handling wrapper for Express route handlers
// Provides core functionality for the task management system
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;