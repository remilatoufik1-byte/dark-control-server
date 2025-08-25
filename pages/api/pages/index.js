import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [notification, setNotification] = useState("");

  // إرسال رسالة إلى ChatGPT
  const sendToChatGPT = async () => {
    if (!message) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setResponse(data.reply || "لا يوجد رد من الخادم");
  };

  // إرسال إشعار
  const sendNotification = async () => {
    if (!notification) return;
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notification }),
    });
    alert("تم إرسال الإشعار بنجاح");
    setNotification("");
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "#333" }}>Dark Control</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <textarea
          placeholder="اكتب رسالتك هنا..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "80%", height: "80px", padding: "10px" }}
        />
        <br />
        <button
          onClick={sendToChatGPT}
          style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          إرسال إلى ChatGPT
        </button>
      </div>

      {response && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <h3>رد ChatGPT:</h3>
          <p>{response}</p>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      <div>
        <textarea
          placeholder="أدخل الإشعار هنا"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
          style={{ width: "80%", height: "60px", padding: "10px" }}
        />
        <br />
        <button
          onClick={sendNotification}
          style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          إرسال إشعار
        </button>
      </div>
    </div>
  );
}
