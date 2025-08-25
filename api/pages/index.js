import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [notify, setNotify] = useState("");

  // إرسال طلب إلى ChatGPT
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.reply || "لا يوجد رد");
    } catch (error) {
      setResponse("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  // إرسال إشعار
  const sendNotification = async () => {
    if (!notify.trim()) return;

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notify }),
      });
      alert("تم إرسال الإشعار بنجاح!");
      setNotify("");
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الإشعار");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dark Control</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>إرسال طلب إلى ChatGPT</h2>
        <textarea
          placeholder="اكتب رسالتك هنا..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={sendMessage}>إرسال إلى ChatGPT</button>
        {response && (
          <div style={{ marginTop: "10px", padding: "10px", background: "#eee" }}>
            <strong>الرد:</strong> {response}
          </div>
        )}
      </div>

      <div>
        <h2>إرسال إشعار</h2>
        <textarea
          placeholder="أدخل الإشعار هنا"
          value={notify}
          onChange={(e) => setNotify(e.target.value)}
          rows={2}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={sendNotification}>إرسال إشعار</button>
      </div>
    </div>
  );
  }
