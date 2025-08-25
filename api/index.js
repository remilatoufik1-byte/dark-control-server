document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatResponse = document.getElementById("chat-response");

  const notifyForm = document.getElementById("notify-form");
  const notifyInput = document.getElementById("notify-input");

  // ✅ إرسال الرسالة إلى ChatGPT عبر API
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    chatResponse.textContent = "جارٍ الإرسال...";

    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      chatResponse.textContent = data.reply || "لم يتم استلام رد.";
    } catch (error) {
      console.error(error);
      chatResponse.textContent = "حدث خطأ أثناء الاتصال.";
    }
  });

  // ✅ إرسال إشعار
  notifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const notification = notifyInput.value.trim();
    if (!notification) return;

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification })
      });

      alert("تم إرسال الإشعار بنجاح!");
      notifyInput.value = "";
    } catch (error) {
      console.error(error);
      alert("فشل في إرسال الإشعار.");
    }
  });
});
