async function sendToChatGPT() {
  const message = document.getElementById('chatInput').value;
  const responseElement = document.getElementById('chatResponse');
  responseElement.textContent = "جارٍ الإرسال...";
  
  try {
    const res = await fetch('/api/chatgpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    responseElement.textContent = data.reply || "حدث خطأ أثناء الاتصال بـ ChatGPT";
  } catch (error) {
    responseElement.textContent = "خطأ في الاتصال";
  }
}

async function sendNotification() {
  const notification = document.getElementById('notifyInput').value;
  const responseElement = document.getElementById('notifyResponse');
  responseElement.textContent = "جارٍ الإرسال...";
  
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification })
    });
    const data = await res.json();
    responseElement.textContent = data.message || "تم إرسال الإشعار";
  } catch (error) {
    responseElement.textContent = "خطأ في إرسال الإشعار";
  }
}
