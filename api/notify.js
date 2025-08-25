export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { notification } = req.body;

  if (!notification) {
    return res.status(400).json({ error: "Notification text is required" });
  }

  try {
    // هنا فقط سنطبع الإشعار في السيرفر (أو يمكن لاحقًا ربطه مع بوت تيليغرام)
    console.log("📢 إشعار جديد:", notification);

    return res.status(200).json({ success: true, message: "تم إرسال الإشعار بنجاح!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "حدث خطأ أثناء إرسال الإشعار" });
  }
}
