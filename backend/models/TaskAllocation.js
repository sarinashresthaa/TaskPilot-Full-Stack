 
// Task allocation model for user-task assignments

const mongoose = require('mongoose');

const taskAllocationSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  teamMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned','todo', 'in-progress', 'done', 'rejected'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  deadline: {
    type: Date,
    required: true
  },
  acceptedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  hoursSpent: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});


taskAllocationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch(this.status) {
      case 'accepted':
        this.acceptedAt = new Date();
        break;
      case 'rejected':
        this.rejectedAt = new Date();
        break;
      case 'completed':
        this.completedAt = new Date();
        break;
    }
  }
  next();
});


taskAllocationSchema.index({ task: 1, teamMember: 1 }, { unique: true });

module.exports = mongoose.model('TaskAllocation', taskAllocationSchema);