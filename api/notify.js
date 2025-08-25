export default function handler(req, res) {
  if (req.method === 'POST') {
    const { notification } = req.body;
    if (!notification) {
      return res.status(400).json({ error: 'Notification text is required' });
    }
    return res.status(200).json({ message: `Notification sent: ${notification}` });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
