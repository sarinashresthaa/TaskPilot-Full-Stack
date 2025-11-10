 
// Administrative route definitions for system management operations
// Provides core functionality for the task management system
const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { requireAdmin, requireProjectManager, requireTeamMemberOrAbove } = require('../middleware/rbac');

const router = express.Router();

// Apply auth to all routes
router.use(auth);

// User routes - different permissions for different operations
router.get('/users', requireProjectManager, adminController.getAllUsers); // Project managers can view users
router.get('/users/:id', requireProjectManager, adminController.getUserById); // Project managers can view user details
router.post('/users', requireProjectManager, adminController.createUser); // Project managers can create users
router.put('/users/:id', requireAdmin, adminController.updateUser); // Only admins can update users
router.delete('/users/:id', requireAdmin, adminController.deleteUser); // Only admins can delete users
router.patch('/users/:id/role', requireAdmin, adminController.assignRole); // Only admins can assign roles

// Project routes for admin operations
router.get('/projects', requireProjectManager, adminController.getAllProjects); // Get all projects for user assignment

// Admin-only routes
router.get('/activity-logs', requireAdmin, adminController.getActivityLogs);
router.get('/system-stats', requireAdmin, adminController.getSystemStats);

module.exports = router;