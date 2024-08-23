const { createServer } = require('node:http');
const router = require('./router');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a particular origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content
        res.end();
        return;
    }
    router.run(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});