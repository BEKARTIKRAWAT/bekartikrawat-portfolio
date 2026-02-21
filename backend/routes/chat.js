const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant for Kartik Rawat portfolio. Kartik is a Full Stack Developer. Skills: HTML, CSS, JavaScript, Node.js, Express, MongoDB, React, Git. Email: kartikrawat1333@gmail.com. Available for freelance work.'
        },
        { role: 'user', content: message }
      ],
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('Groq Error:', err.response?.data || err.message);
    res.status(500).json({ reply: 'Sorry, kuch problem ho gayi!' });
  }
});

module.exports = router;