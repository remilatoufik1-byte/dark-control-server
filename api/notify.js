import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// اختبار
router.get('/test', (req, res) => {
  res.send('✅ إشعارات تيليجرام جاهزة');
});

// إرسال إشعار
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: '❌ أدخل الرسالة' });

  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '❌ فشل في إرسال الإشعار' });
  }
});

export default router;
