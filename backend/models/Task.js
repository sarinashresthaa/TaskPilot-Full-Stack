 
// Task data model with assignment, dependencies, and status management
// Provides core functionality for the task management system
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done', 'rejected'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['development', 'testing', 'documentation', 'design', 'deployment', 'other'],
    default: 'development'
  },
  subCategory: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'api', 'ui/ux', 'unit-test', 'integration-test', 'other'],
    default: 'other'
  },
  deadline: {
    type: Date,
    required: true
  },
  estimatedEffort: {
    type: Number,
    default: 0
  },
  actualEffort: {
    type: Number,
    default: 0
  },
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  completedAt: {
    type: Date
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});


taskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'done') {
      this.completedAt = new Date();
    } else if (this.status !== 'done') {
      this.completedAt = null;
    }
  }
  next();
});


taskSchema.methods.areDependenciesCompleted = async function() {
  if (!this.dependencies || this.dependencies.length === 0) {
    return true;
  }
  
  const Task = mongoose.model('Task');
  const dependentTasks = await Task.find({ _id: { $in: this.dependencies } });
  
  return dependentTasks.every(task => task.status === 'done');
};


taskSchema.methods.isAssignedTo = function(userId) {
  return this.assignedTo.some(user => user.toString() === userId.toString());
};


taskSchema.virtual('isOverdue').get(function() {
  return this.deadline < new Date() && this.status !== 'done' && this.status !== 'cancelled';
});


taskSchema.virtual('daysUntilDeadline').get(function() {
  if (this.status === 'done' || this.status === 'cancelled') {
    return null;
  }
  const today = new Date();
  const days = Math.ceil((this.deadline - today) / (1000 * 60 * 60 * 24));
  return days;
});


taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);