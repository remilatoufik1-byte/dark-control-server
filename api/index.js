import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.reply || 'No response from server');
    } catch (error) {
      console.error(error);
      setResponse('خطأ في الإرسال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Dark Control</h1>
      <textarea
        placeholder="اكتب رسالتك هنا..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
      />
      <br />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {loading ? 'جاري الإرسال...' : 'إرسال إلى ChatGPT'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>الرد:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}
