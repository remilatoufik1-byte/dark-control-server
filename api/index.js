export default function handler(req, res) {
  // تحقق من طريقة الطلب
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // تحقق من وجود المفتاح السري
  const clientKey = req.headers['x-secret-key'];
  const serverKey = process.env.SECRET_API_KEY;

  if (!clientKey || clientKey !== serverKey) {
    return res.status(403).json({ error: 'Forbidden: Invalid Secret Key' });
  }

  // هنا تضع الكود الأساسي (مثلاً: الاتصال بـ ChatGPT)
  return res.status(200).json({ message: 'تم التحقق بنجاح، المفتاح صحيح ✅' });
}
