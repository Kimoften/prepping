const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const { spawn } = require('child_process');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;

const app = express();

// Flask 백엔드 실행
const flaskProcess = spawn('python', ['be/app.py']);
flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask: ${data}`);
});
flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask Error: ${data}`);
});

nextApp.prepare().then(() => {
    app.use('/api', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));

    // 모든 Next.js 요청 처리
    app.all('*', (req, res) => handle(req, res));

    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
