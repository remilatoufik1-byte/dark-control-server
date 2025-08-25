export default function handler(req, res) {
  res.status(200).send(`
    <h1>Dark Control API is Running ✅</h1>
    <p>Endpoints:</p>
    <ul>
      <li>/api/chatgpt - Chat with GPT</li>
      <li>/api/notify - Send Notifications</li>
    </ul>
  `);
}
