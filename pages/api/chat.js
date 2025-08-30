// pages/api/chat.js
// Responsibilities:
// - Verify SECRET_API_KEY via header: x-secret-key
// - Rate-limit minimally (in-memory; for production use Redis or external store)
// - Forward to OpenAI and return result
const RATE_LIMIT_MAX = 8; // max requests per window per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// simple in-memory store (not persistent across serverless invocations; upgrade to Redis for prod)
const ipStore = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipStore.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    // reset
    ipStore.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  ipStore.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  // security: header check
  const clientKey = req.headers["x-secret-key"] || req.headers["x-api-key"];
  const serverKey = process.env.SECRET_API_KEY;
  if (!serverKey) return res.status(500).json({ error: "Server misconfig: SECRET_API_KEY missing" });
  if (!clientKey || clientKey !== serverKey) return res.status(403).json({ error: "Unauthorized" });

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  const { message } = req.body || {};
  if (!message || !message.toString().trim()) return res.status(400).json({ error: "Message is required" });

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: "Server misconfig: OPENAI_API_KEY missing" });

  try {
    // Forward to OpenAI Chat Completions
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "أنت مساعد ذكي، أجب بإيجاز ومهنية." },
          { role: "user", content: message.toString() }
        ],
        max_tokens: 800
      })
    });

    const data = await openaiRes.json();
    if (!openaiRes.ok) {
      console.error("OpenAI error:", data);
      return res.status(502).json({ error: data?.error?.message || "OpenAI error", details: data });
    }

    const reply = data?.choices?.[0]?.message?.content || "No reply";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: String(err.message || err) });
  }
}
