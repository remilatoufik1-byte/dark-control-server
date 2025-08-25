import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [{ role: "user", content: message }]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    res.status(200).json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to OpenAI', details: error.message });
  }
}
