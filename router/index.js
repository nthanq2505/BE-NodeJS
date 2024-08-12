const { 
    addTask, 
    handleNotFound 
} = require('../controllers');

const routes = {
    '/add-task': { 
        "POST": {
            controller: addTask,
        }
    },
}

function route(request) {
    const url = request.url;
    const method = request.method;

    if (routes[url] && routes[url][method]) {
        return routes[url][method].controller;
    }

    return handleNotFound;
}

module.exports = {
    route
}