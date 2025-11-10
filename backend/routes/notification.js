 
// Notification route definitions for alert management
// Provides core functionality for the task management system
const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', auth, notificationController.getUserNotifications);


router.patch('/:id/read', auth, notificationController.markAsRead);

module.exports = router;