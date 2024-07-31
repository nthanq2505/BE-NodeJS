const { handlePing, handleHello } = require('./controller');

function router(req, res) {
    if (req.url === '/ping' && req.method === 'GET') {
        handlePing(req, res);
    } else {
        handleHello(req, res);
    }
}

module.exports = {
    router
}