import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// اختبار
router.get('/test', (req, res) => {
  res.send('✅ ChatGPT API جاهزة');
});

// تفاعل مع ChatGPT
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: '❌ الرجاء إدخال النص' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '❌ فشل في الاتصال بـ OpenAI' });
  }
});

export default router;
