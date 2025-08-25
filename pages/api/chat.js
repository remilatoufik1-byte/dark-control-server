export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { notification } = req.body;
  if (!notification) {
    return res.status(400).json({ error: "الإشعار مطلوب" });
  }

  // هنا يمكنك لاحقًا ربطها مع خدمة خارجية مثل Firebase أو Telegram Bot
  return res.status(200).json({ message: `تم إرسال الإشعار: ${notification}` });
}
