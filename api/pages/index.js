import { useState } from "react";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    if (!userInput) return alert("اكتب رسالة أولا!");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
      });

      if (!res.ok) {
        throw new Error(`خطأ في الاتصال: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error(error);
      setResponse("❌ فشل الإرسال. تحقق من الخادم.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dark Control</h1>
      <input
        type="text"
        placeholder="اكتب رسالتك هنا..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button
        onClick={sendMessage}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        إرسال إلى ChatGPT
      </button>
      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        <strong>الرد:</strong> {response}
      </div>
    </div>
  );
}
