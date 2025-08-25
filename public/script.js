async function sendPrompt() {
  const prompt = document.getElementById('prompt').value;
  const responseElement = document.getElementById('response');

  responseElement.textContent = "جارٍ الإرسال...";
  
  const res = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  responseElement.textContent = data.response || "حدث خطأ!";
}

async function sendNotification() {
  const message = document.getElementById('notifyMessage').value;
  const statusElement = document.getElementById('notifyStatus');

  statusElement.textContent = "جارٍ الإرسال...";
  
  const res = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  statusElement.textContent = data.status || "تم الإرسال!";
}
