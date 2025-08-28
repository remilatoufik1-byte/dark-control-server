export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "أنت مساعد ذكي يرد بإيجاز وبوضوح." },
            { role: "user", content: message }
          ]
        })
      });

      const data = await response.json();

      if (data.error) {
        return res.status(500).json({ error: data.error.message });
      }

      return res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
      return res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بـ OpenAI' });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
