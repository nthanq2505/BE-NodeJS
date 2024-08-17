const taskControllers = require('./tasks');
const userControllers = require('./users');

function handleNotFound(req, res) {
    res.statusCode = 404;
    res.end('Not Found')
}

module.exports = {
    handleNotFound,
    ...taskControllers,
    ...userControllers
};
