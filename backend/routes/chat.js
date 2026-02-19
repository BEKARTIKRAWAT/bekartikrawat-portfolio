const express = require('express');
const router = express.Router();
const axios = require('axios');
const Chat = require('../models/Chat');

const KARTIK_INFO = `
You are an AI assistant for Kartik Rawat's personal portfolio website.
Answer questions about Kartik in a friendly and professional way.

👤 PERSONAL INFO:
- Full Name: Kartik Rawat
- Username: bekartikrawat (same on ALL platforms)
- Email: kartikrawat1333@gmail.com
- Status: Available for freelance work

🌐 SOCIAL MEDIA:
- GitHub: github.com/bekartikrawat
- LinkedIn: linkedin.com/in/bekartikrawat
- Instagram: instagram.com/bekartikrawat
- Twitter/X: twitter.com/bekartikrawat
- YouTube: youtube.com/@bekartikrawat

💻 SKILLS:
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Tools: Git, GitHub
- Learning: React.js

INSTRUCTIONS:
- Be friendly and concise
- Use emojis occasionally
- Keep replies short (2-4 sentences)
- If you don't know something say "Kartik hasn't shared that yet, contact him at kartikrawat1333@gmail.com 😊"
`;

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: KARTIK_INFO + '\n\nUser: ' + message
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;

    await Chat.create({ message: message.trim(), reply, ip: req.ip });
    res.json({ reply });

  } catch (err) {
    console.error('❌ Chat Error:', err.message);
    const fallbacks = [
      "Hey! I'm having trouble right now. Contact Kartik at kartikrawat1333@gmail.com 📧",
      "Oops! Try contacting Kartik at @bekartikrawat on any platform! 🚀"
    ];
    res.json({ reply: fallbacks[Math.floor(Math.random() * fallbacks.length)] });
  }
});

module.exports = router;