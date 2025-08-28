import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return alert("أدخل رسالتك أولاً");

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.error) {
        setResponse("❌ خطأ: " + data.error);
      } else {
        setResponse(data.reply);
      }
    } catch (error) {
      setResponse("❌ حدث خطأ في الإرسال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Dark Control</h1>
      <textarea
        placeholder="اكتب رسالتك هنا..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: "100px", padding: "10px", marginBottom: "10px" }}
      />
      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
        disabled={loading}
      >
        {loading ? "جاري الإرسال..." : "إرسال إلى ChatGPT"}
      </button>
      <div style={{ marginTop: "20px", background: "#f4f4f4", padding: "15px" }}>
        <h3>الرد:</h3>
        <p>{response || "لا يوجد رد بعد"}</p>
      </div>
    </div>
  );
}
