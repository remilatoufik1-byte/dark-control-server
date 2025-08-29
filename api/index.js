import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      alert('الرجاء إدخال رسالة قبل الإرسال');
      return;
    }

    setLoading(true);
    setReply('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل الإرسال');
      }

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الإرسال: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Dark Control</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder="اكتب رسالتك لـ ChatGPT"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'جارٍ الإرسال...' : 'إرسال'}
      </button>
      {reply && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <strong>رد ChatGPT:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
