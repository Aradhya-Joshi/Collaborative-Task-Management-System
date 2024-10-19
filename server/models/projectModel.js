const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming you also have a User model later
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
