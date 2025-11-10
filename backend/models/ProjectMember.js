 
// Project membership model for team member associations
// Provides core functionality for the task management system
const mongoose = require('mongoose');

const projectMemberSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  role: {
    type: String,
    enum: ['manager', 'member', 'viewer'],
    default: 'member'
  },
  permissions: {
    canCreateTasks: {
      type: Boolean,
      default: false
    },
    canAssignTasks: {
      type: Boolean,
      default: false
    },
    canDeleteTasks: {
      type: Boolean,
      default: false
    },
    canEditProject: {
      type: Boolean,
      default: false
    }
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


projectMemberSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch(this.role) {
      case 'manager':
        this.permissions = {
          canCreateTasks: true,
          canAssignTasks: true,
          canDeleteTasks: true,
          canEditProject: true
        };
        break;
      case 'member':
        this.permissions = {
          canCreateTasks: true,
          canAssignTasks: false,
          canDeleteTasks: false,
          canEditProject: false
        };
        break;
      case 'viewer':
        this.permissions = {
          canCreateTasks: false,
          canAssignTasks: false,
          canDeleteTasks: false,
          canEditProject: false
        };
        break;
    }
  }
  next();
});


projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ProjectMember', projectMemberSchema);