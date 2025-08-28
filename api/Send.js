// pages/api/send.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "الرسالة مطلوبة" });
  }

  return res.status(200).json({ success: true, reply: `تم الاستلام: ${message}` });
}
