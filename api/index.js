import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [notification, setNotification] = useState("");
  const [status, setStatus] = useState("");

  const sendToChat = async () => {
    if (!message.trim()) return alert("أدخل رسالة");
    setStatus("جارٍ الإرسال إلى ChatGPT...");
    setResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      setResponse(data.reply || "لا يوجد رد");
    } catch (e) {
      setResponse("حدث خطأ: " + e.message);
    } finally {
      setStatus("");
    }
  };

  const sendNotify = async () => {
    if (!notification.trim()) return alert("أدخل نص الإشعار");
    setStatus("جارٍ إرسال الإشعار إلى تيليغرام...");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      alert("✅ تم إرسال الإشعار إلى تيليغرام");
      setNotification("");
    } catch (e) {
      alert("❌ فشل إرسال الإشعار: " + e.message);
    } finally {
      setStatus("");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 24, maxWidth: 720, margin: "0 auto", color: "#f0f6fc", background: "#0d1117", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#58a6ff" }}>Dark Control</h1>

      {/* ChatGPT */}
      <div style={{ background: "#161b22", padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ color: "#f0883e" }}>إرسال طلب إلى ChatGPT</h3>
        <textarea
          placeholder="اكتب رسالتك هنا..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#0d1117", color: "#f0f6fc" }}
        />
        <button onClick={sendToChat} style={{ marginTop: 10, padding: "10px 16px", borderRadius: 8, border: 0, background: "#238636", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          إرسال إلى ChatGPT
        </button>
        {response && (
          <div style={{ marginTop: 12, background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: 12 }}>
            <strong>رد ChatGPT:</strong>
            <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{response}</div>
          </div>
        )}
      </div>

      {/* Notify */}
      <div style={{ background: "#161b22", padding: 16, borderRadius: 12 }}>
        <h3 style={{ color: "#f0883e" }}>إرسال إشعار (Telegram)</h3>
        <input
          type="text"
          placeholder="أدخل نص الإشعار هنا"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#0d1117", color: "#f0f6fc" }}
        />
        <button onClick={sendNotify} style={{ marginTop: 10, padding: "10px 16px", borderRadius: 8, border: 0, background: "#0d6efd", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          إرسال إشعار
        </button>
      </div>

      {status && <p style={{ marginTop: 16, textAlign: "center" }}>⏳ {status}</p>}
    </div>
  );
}
