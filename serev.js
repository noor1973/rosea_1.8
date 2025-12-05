const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// endpoint يعيد قائمة المنتجات
app.get('/api/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.json'));
});

// endpoint تجريبي لاستقبال طلب شراء (هنا مجرد محاكاة)
app.post('/api/checkout', (req, res) => {
  const order = req.body;
  console.log('New order:', JSON.stringify(order, null, 2));
  // هنا ممكن تربط بقاعدة بيانات أو بوابة دفع
  res.json({ ok: true, message: 'Order received (simulated)' });
});

// serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
