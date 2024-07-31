function handlePing(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('pong');
    res.end();
}

function handleHello(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Hello World\n');
    res.end();
}

module.exports = {
    handlePing,
    handleHello
};
