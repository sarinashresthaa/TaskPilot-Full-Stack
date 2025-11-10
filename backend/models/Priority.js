 
// Priority data model for task priority management
// Provides core functionality for the task management system
const mongoose = require('mongoose');

const prioritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    unique: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  color: {
    type: String,
    default: '#000000'
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


prioritySchema.pre('save', function(next) {
  if (this.isNew) {
    switch(this.name) {
      case 'Low':
        this.color = '#28a745';
        this.level = 1;
        break;
      case 'Medium':
        this.color = '#ffc107';
        this.level = 2;
        break;
      case 'High':
        this.color = '#fd7e14';
        this.level = 3;
        break;
      case 'Urgent':
        this.color = '#dc3545';
        this.level = 4;
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Priority', prioritySchema);