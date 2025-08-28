export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    // استدعاء OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'أنت مساعد ذكي' },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      return res.status(500).json({ error: 'فشل الاتصال بـ OpenAI API' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'لم يتم الحصول على رد من ChatGPT';

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}
