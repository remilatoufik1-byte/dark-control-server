async function sendMessage() {
  const message = document.getElementById('message').value;
  const replyElement = document.getElementById('reply');

  const response = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  replyElement.innerText = data.reply || data.error;
}

async function sendNotification() {
  const notification = document.getElementById('notification').value;

  const response = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notification })
  });

  const data = await response.json();
  alert(data.message || data.error);
}
