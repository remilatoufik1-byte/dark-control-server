import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [notify, setNotify] = useState("");

  // إرسال رسالة إلى ChatGPT
  const sendMessage = async () => {
    if (!message.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setResponse(data.reply || "❌ خطأ في الاتصال مع الخادم");
  };

  // إرسال إشعار
  const sendNotify = async () => {
    if (!notify.trim()) return;
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notify }),
    });
    alert("✅ تم إرسال الإشعار!");
    setNotify("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      
      {/* الشعار */}
      <h1 className="text-5xl font-extrabold mb-8 text-center">
        <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-700 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(138,43,226,0.9)]">
          Dark Control
        </span>
      </h1>

      {/* مربع الحوار مع ChatGPT */}
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl mb-4 font-semibold">💬 أرسل رسالة إلى ChatGPT</h2>
        <textarea
          className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white mb-3"
          rows="3"
          placeholder="اكتب رسالتك هنا..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="w-full bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded-lg transition"
        >
          🚀 إرسال إلى ChatGPT
        </button>
        {response && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <strong>رد ChatGPT:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>

      {/* مربع الإشعار */}
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl mb-4 font-semibold">🔔 إرسال إشعار</h2>
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white mb-3"
          placeholder="أدخل الإشعار هنا"
          value={notify}
          onChange={(e) => setNotify(e.target.value)}
        />
        <button
          onClick={sendNotify}
          className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition"
        >
          📢 إرسال إشعار
        </button>
      </div>
    </div>
  );
}
