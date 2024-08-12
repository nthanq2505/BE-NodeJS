const taskControllers = require('./task.controller');

function handleNotFound(req, res) {
    res.statusCode = 404;
    res.end('Not Found')
}

module.exports = {
    handleNotFound,
    ...taskControllers
};
