export default function handler(req, res) {
  if (req.method === 'POST') {
    const { notification } = req.body;
    return res.status(200).json({ message: `تم استلام الإشعار: ${notification}` });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
