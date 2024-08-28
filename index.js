const { createServer } = require('node:http');
const router = require('./routers');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*'); 
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
    }
    router.run(request, response);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});