const { handlePing, handleHello } = require('./controller');

function router(req, res) {
    if (req.method === 'GET' && req.url === '/ping' ) {
        handlePing(req, res);
    } else {
        handleHello(req, res);
    }
}

module.exports = {
    router
}