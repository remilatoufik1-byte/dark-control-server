// pages/index.js
import { useEffect, useState } from "react";
import "../styles/globals.css";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [notify, setNotify] = useState("");
  const [loading, setLoading] = useState(false);

  // CLIENT_KEY يتم أخذه من متغير بيئي علشان نرسل الهيدر الأمني
  const CLIENT_KEY = process.env.NEXT_PUBLIC_CLIENT_KEY || "";

  const sendChat = async () => {
    if (!message.trim()) return alert("الرجاء إدخال رسالة");
    setLoading(true);
    setReply("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": CLIENT_KEY
        },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setReply(data.reply || "");
    } catch (e) {
      console.error("Chat send error:", e);
      setReply("خطأ في الاتصال أو المعالجة: " + (e.message || ""));
    } finally { setLoading(false); }
  };

  const sendNotify = async () => {
    if (!notify.trim()) return alert("اكتب نص الإشعار");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": CLIENT_KEY
        },
        body: JSON.stringify({ notification: notify })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Notify failed");
      alert("تم إرسال الإشعار إلى Telegram");
      setNotify("");
    } catch (e) {
      console.error("Notify error:", e);
      alert("فشل إرسال الإشعار: " + (e.message || ""));
    }
  };

  return (
    <div className="container">
      <h1 style={{color:"var(--accent)", marginBottom:12}}>Dark Control — Dashboard</h1>

      <div className="panel" style={{marginBottom:16}}>
        <h3>ChatGPT</h3>
        <textarea className="input" rows={5} placeholder="اكتب رسالتك..." value={message} onChange={(e)=>setMessage(e.target.value)} />
        <div style={{marginTop:8, display:"flex", gap:8}}>
          <button className="btn small-btn" onClick={sendChat} disabled={loading}>
            {loading? "جاري الإرسال..." : "إرسال إلى ChatGPT"}
          </button>
          <button className="small-btn" onClick={()=>{ setMessage(""); setReply(""); }}>مسح</button>
        </div>

        <div style={{marginTop:12}}>
          <strong>الرد:</strong>
          <div className="reply" style={{marginTop:8}}>{reply || "لا يوجد رد حتى الآن"}</div>
        </div>
      </div>

      <div className="panel">
        <h3>إشعارات (Telegram)</h3>
        <input className="input" placeholder="نص الإشعار..." value={notify} onChange={(e)=>setNotify(e.target.value)} />
        <div style={{marginTop:8, display:"flex", gap:8}}>
          <button className="btn small-btn" onClick={sendNotify}>إرسال إشعار</button>
          <button className="small-btn" onClick={()=>setNotify("")}>مسح</button>
        </div>
        <p className="note">ملاحظة: الإشعارات تُرسل عبر Telegram Bot المعرّف في Environment Variables.</p>
      </div>

      <p className="note" style={{marginTop:12}}>
        جاهز للنشر. تأكد من إضافة المتغيرات البيئية ثم اضغط Redeploy على Vercel.
      </p>
    </div>
  );
    }
