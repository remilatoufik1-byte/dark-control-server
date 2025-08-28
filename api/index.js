import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [notification, setNotification] = useState("");

  // إرسال طلب إلى ChatGPT
  const sendMessage = async () => {
    if (!message) return alert("أدخل رسالة");
    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.reply || "لا يوجد رد");
    } catch (error) {
      console.error(error);
      setResponse("حدث خطأ");
    }
  };

  // إرسال إشعار
  const sendNotification = async () => {
    if (!notification) return alert("أدخل الإشعار");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("خطأ أثناء إرسال الإشعار");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Dark Control</h1>

      {/* قسم إرسال رسالة إلى ChatGPT */}
      <div style={{ marginBottom: "20px" }}>
        <h3>أرسل طلب إلى ChatGPT</h3>
        <input
          type="text"
          placeholder="اكتب رسالتك هنا..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "80%", padding: "10px", marginRight: "10px" }}
        />
        <button onClick={sendMessage}>إرسال إلى ChatGPT</button>
        {response && <p><strong>الرد:</strong> {response}</p>}
      </div>

      {/* قسم إرسال إشعار */}
      <div>
        <h3>إرسال إشعار</h3>
        <input
          type="text"
          placeholder="أدخل الإشعار هنا"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
          style={{ width: "80%", padding: "10px", marginRight: "10px" }}
        />
        <button onClick={sendNotification}>إرسال إشعار</button>
      </div>
    </div>
  );
}
