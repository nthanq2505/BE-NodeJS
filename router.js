const { handlePing, handleHello } = require('./controller');

function router(req, res) {
    if (req.url === '/ping') {
        if (req.method === 'GET') {
            handlePing(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
        }
    } else if (req.url === '/') {
        if (req.method === 'GET') {
            handleHello(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

module.exports = {
    router
}