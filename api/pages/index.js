import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [notification, setNotification] = useState("");
  const [notifyResponse, setNotifyResponse] = useState("");

  // إرسال رسالة إلى ChatGPT
  const sendMessage = async () => {
    if (!message) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setResponse(data.reply || "لا يوجد رد");
  };

  // إرسال إشعار
  const sendNotification = async () => {
    if (!notification) return;
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notification }),
    });
    const data = await res.json();
    setNotifyResponse(data.message || "تم الإرسال");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "30px" }}>
      <h1>📡 Dark Control</h1>

      {/* قسم ChatGPT */}
      <div style={{ marginBottom: "40px" }}>
        <h2>إرسال طلب إلى ChatGPT</h2>
        <textarea
          placeholder="اكتب رسالتك هنا..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <br />
        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
          إرسال إلى ChatGPT
        </button>
        <p><b>الرد:</b> {response}</p>
      </div>

      {/* قسم الإشعارات */}
      <div>
        <h2>إرسال إشعار</h2>
        <input
          type="text"
          placeholder="أدخل الإشعار هنا"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <br />
        <button onClick={sendNotification} style={{ padding: "10px 20px" }}>
          إرسال إشعار
        </button>
        <p><b>النتيجة:</b> {notifyResponse}</p>
      </div>
    </div>
  );
}
