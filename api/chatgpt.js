export default async function handler(req, res) {
  try {
    // 1) السماح بـ POST فقط
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2) التحقق من المفتاح السري القادم من العميل
    const clientKey = req.headers['x-api-key'];
    const serverKey = process.env.SECRET_API_KEY;
    if (!serverKey) {
      return res.status(500).json({ error: 'Server misconfig: SECRET_API_KEY is missing' });
    }
    if (!clientKey || clientKey !== serverKey) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // 3) التحقق من الـ payload
    const { message } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Invalid payload: "message" is required' });
    }

    // 4) مفتاح OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Server misconfig: OPENAI_API_KEY is missing' });
    }

    // 5) استدعاء OpenAI Chat Completions
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({ error: data?.error?.message || 'OpenAI request failed' });
    }

    const reply = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Unhandled error', details: String(err?.message || err) });
  }
}
