sexport default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Dark Control Server is running ✅' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
