 
// Notification controller for managing user notifications and alerts
// Provides core functionality for the task management system
const Notification = require('../models/Notification');
const TaskAllocation = require('../models/TaskAllocation');


exports.getUserNotifications = async (req, res) => {
  try {
    // Query notifications directly by recipient instead of taskAllocation
    const notifications = await Notification.find({
      recipient: req.user._id
    })
    .populate({
      path: 'taskAllocation',
      populate: {
        path: 'task',
        select: 'title'
      }
    })
    .populate('task', 'title')
    .populate('project', 'title')
    .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to the requesting user
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};