export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // هنا يمكنك لاحقاً إضافة OpenAI API
  res.status(200).json({ reply: `✅ تم استلام الرسالة: ${message}` });
}
