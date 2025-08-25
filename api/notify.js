export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { notification } = req.body;
  if (!notification) {
    return res.status(400).json({ error: "الإشعار مطلوب" });
  }

  try {
    // هنا فقط نرجع الإشعار (ممكن لاحقًا نربطه مع قاعدة بيانات أو بوت تيليغرام)
    return res.status(200).json({ success: true, message: notification });
  } catch (error) {
    return res.status(500).json({ error: "حدث خطأ في الخادم", details: error.message });
  }
}
