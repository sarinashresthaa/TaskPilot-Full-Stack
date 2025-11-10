 
// Project data model with team management and progress tracking
// Provides core functionality for the task management system
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['research','design', 'development', 'infrastructure', 'marketing', 'other'],
    default: 'development'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold', 'cancelled'],
    default: 'active'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


projectSchema.methods.calculateProgress = async function() {
  const Task = mongoose.model('Task');
  const tasks = await Task.find({ project: this._id });
  
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / tasks.length) * 100);
};


projectSchema.methods.isManager = function(userId) {
  return this.manager.toString() === userId.toString();
};


projectSchema.methods.isTeamMember = function(userId) {
  return this.teamMembers.some(member => member.toString() === userId.toString());
};


projectSchema.virtual('duration').get(function() {
  if (this.endDate && this.startDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});


projectSchema.virtual('daysRemaining').get(function() {
  if (this.endDate && this.status === 'active') {
    const today = new Date();
    const remaining = Math.ceil((this.endDate - today) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return 0;
});


projectSchema.virtual('isOverdue').get(function() {
  return this.status === 'active' && this.endDate < new Date();
});


projectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);