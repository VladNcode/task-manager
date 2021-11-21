const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: [true, 'Task must have a description'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model('Task', tasksSchema);

module.exports = Task;
