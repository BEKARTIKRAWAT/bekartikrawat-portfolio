const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Contact Message Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields required' });
  }
  try {
    await Contact.create({ name, email, message });
    res.json({ success: true, message: 'Message saved successfully!' });
  } catch (err) {
    console.error('Contact Error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
