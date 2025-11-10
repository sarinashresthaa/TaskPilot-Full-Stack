 
// Request validation middleware for input sanitization and validation
// Provides core functionality for the task management system
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const validateId = (req, res, next) => {
  const id = req.params.id || req.params.projectId || req.params.taskId;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  next();
};

module.exports = {
  validateRequest,
  validateId
};