const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  reply: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
    default: 'unknown'
  }
});

module.exports = mongoose.model('Chat', chatSchema);
