// pages/api/notify.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  const clientKey = req.headers["x-secret-key"] || req.headers["x-api-key"];
  const serverKey = process.env.SECRET_API_KEY;
  if (!serverKey) return res.status(500).json({ error: "Server misconfig: SECRET_API_KEY missing" });
  if (!clientKey || clientKey !== serverKey) return res.status(403).json({ error: "Unauthorized" });

  const { notification } = req.body || {};
  if (!notification || !notification.toString().trim()) return res.status(400).json({ error: "Notification required" });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ error: "Server misconfig: Telegram credentials missing" });

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 Notification from Dark Control:\n${notification}`
      })
    });

    const tgJson = await tgRes.json();
    if (!tgRes.ok || tgJson?.ok !== true) {
      console.error("Telegram API error:", tgJson);
      return res.status(502).json({ error: "Telegram API failed", details: tgJson });
    }

    return res.status(200).json({ success: true, message: "Notification delivered to Telegram" });
  } catch (err) {
    console.error("Notify handler error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: String(err.message || err) });
  }
                    }
