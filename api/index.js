import express from "express";
import bodyParser from "body-parser";
import { askChatGPT } from "./chatgpt.js";
import { sendNotification } from "./notify.js";

const app = express();
app.use(bodyParser.json());

// ✅ Route للتحقق من تشغيل السيرفر
app.get("/", (req, res) => {
  res.send("✅ Dark Control Server is Running");
});

// ✅ Route لإرسال سؤال إلى ChatGPT
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Missing question" });

    const response = await askChatGPT(question);

    // أرسل إشعار عند كل سؤال جديد
    await sendNotification(`📩 New ChatGPT Request:\n${question}`);

    res.json({ answer: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
