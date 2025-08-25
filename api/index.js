export default function Home() {
  const sendMessage = async () => {
    const message = document.getElementById("message").value;
    if (!message) return alert("أدخل الرسالة أولاً");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    alert(data.response || "تم الإرسال!");
  };

  const sendNotification = async () => {
    const notification = document.getElementById("notification").value;
    if (!notification) return alert("أدخل الإشعار أولاً");

    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notification }),
    });

    const data = await res.json();
    alert(data.message || "تم إرسال الإشعار!");
  };

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      padding: "30px",
      maxWidth: "600px",
      margin: "auto",
      backgroundColor: "#111",
      color: "#fff",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(0,0,0,0.5)"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Dark Control</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>إرسال رسالة إلى ChatGPT</h3>
        <textarea id="message" placeholder="اكتب رسالتك هنا..." style={{
          width: "100%", height: "100px", padding: "10px", borderRadius: "8px", border: "none"
        }}></textarea>
        <button onClick={sendMessage} style={{
          width: "100%", marginTop: "10px", padding: "12px", background: "#0070f3", color: "#fff",
          fontSize: "16px", border: "none", borderRadius: "8px", cursor: "pointer"
        }}>إرسال إلى ChatGPT</button>
      </div>

      <div>
        <h3>إرسال إشعار</h3>
        <input id="notification" type="text" placeholder="أدخل الإشعار هنا" style={{
          width: "100%", padding: "10px", borderRadius: "8px", border: "none"
        }} />
        <button onClick={sendNotification} style={{
          width: "100%", marginTop: "10px", padding: "12px", background: "#e91e63", color: "#fff",
          fontSize: "16px", border: "none", borderRadius: "8px", cursor: "pointer"
        }}>إرسال إشعار</button>
      </div>
    </div>
  );
}
