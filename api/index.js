import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// صفحة رئيسية
app.get('/', (req, res) => {
  res.send(`
    <h1>Dark Control Server</h1>
    <p>لوحة التحكم:</p>
    <ul>
      <li><a href="/api/chatgpt/test">اختبار ChatGPT</a></li>
      <li><a href="/api/notify/test">اختبار الإشعارات</a></li>
    </ul>
  `);
});

// استدعاء المسارات
import chatgptRoutes from './chatgpt.js';
import notifyRoutes from './notify.js';

app.use('/api/chatgpt', chatgptRoutes);
app.use('/api/notify', notifyRoutes);

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
