const { 
    handleAddTask, 
    handleUpdateTask,
    handleGetTasksById,
    handleDeleteTaskById,
    handleNotFound 
} = require('../controllers');

const routes = {
    '/add-task': { 
        'POST': {
            controller: handleAddTask,
        }
    },
    '/update-task': { 
        'PUT': {
            controller: handleUpdateTask,
        }
    },
    '/get-tasks': { 
        'GET': {
            controller: handleGetTasksById,
        }
    },
    '/delete-task': { 
        'DELETE': {
            controller: handleDeleteTaskById,
        }
    }

};

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