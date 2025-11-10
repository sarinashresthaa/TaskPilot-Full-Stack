 
// Notification data model for user alert management
// Provides core functionality for the task management system
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskAllocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskAllocation'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'task_assigned',
      'task_updated',
      'task_completed',
      'task_overdue',
      'deadline_reminder',
      'project_invitation',
      'project_update',
      'comment_mention',
      'comment_reply'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  actionUrl: {
    type: String
  }
}, {
  timestamps: true
});


notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead) {
    this.readAt = new Date();
  }
  next();
});


notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);