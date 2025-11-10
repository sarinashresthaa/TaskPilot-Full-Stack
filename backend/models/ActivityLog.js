 
// Activity logging model for audit trails and system monitoring
// Provides core functionality for the task management system
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_login',
      'user_logout',
      'user_created',
      'user_updated',
      'user_deleted',
      'project_created',
      'project_updated',
      'project_deleted',
      'task_created',
      'task_updated',
      'task_deleted',
      'task_assigned',
      'task_status_changed',
      'comment_added',
      'team_member_added',
      'team_member_removed',
      'role_changed'
    ]
  },
  targetType: {
    type: String,
    enum: ['User', 'Project', 'Task'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});


activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1 });
activityLogSchema.index({ action: 1, createdAt: -1 });


activityLogSchema.statics.logActivity = async function(data) {
  try {
    const log = new this(data);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);