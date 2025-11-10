// backend/simple-test.js
const express = require('express');
const app = express();

console.log('Starting simple test server...');

// Log absolutely everything
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Server is working!' });
});

app.get('*', (req, res) => {
    console.log('Catch-all route hit for:', req.url);
    res.json({ message: 'Catch all route', path: req.url });
});

const PORT = 8800;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Simple test server is running on http://localhost:${PORT}`);
    console.log(`Test it with: curl http://localhost:${PORT}/test`);
});
