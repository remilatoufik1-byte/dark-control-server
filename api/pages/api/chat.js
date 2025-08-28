// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await openaiRes.json();
    if (data?.choices?.length) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    }
    return res.status(502).json({ error: "OpenAI returned no choices", details: data });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}
