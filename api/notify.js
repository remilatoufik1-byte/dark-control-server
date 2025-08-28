// pages/api/notify.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { notification } = req.body;
  if (!notification || !notification.trim()) {
    return res.status(400).json({ error: "Notification text is required" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Telegram credentials are missing" });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 إشعار جديد:\n${notification}`
      })
    });

    const tgData = await tgRes.json();
    if (!tgRes.ok || tgData.ok !== true) {
      return res.status(502).json({ error: "Failed to send Telegram message", details: tgData });
    }

    return res.status(200).json({ success: true, message: "Notification delivered to Telegram" });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}
