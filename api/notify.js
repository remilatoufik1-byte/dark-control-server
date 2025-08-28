// pages/api/notify.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { notification } = req.body;

  if (!notification) {
    return res.status(400).json({ error: 'Notification text is required' });
  }

  // في هذه النسخة، سنرجع إشعار بسيط فقط
  return res.status(200).json({ message: `Notification sent: ${notification}` });
}
