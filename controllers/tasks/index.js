const fs = require('fs')

const path = "./database/tasks.json";


//Create
function handleAddTask(request, response) {
    const chunks = [];
    request.on('data', chunk => {
        chunks.push(chunk);
    });
    request.on('end', () => {
        const task = Buffer.concat(chunks).toString();
        fs.readFile(path, "utf8", (error, data) => {
            if (error) {
                console.log(error);
                response.statusCode = 500;
                response.end();
                return;
            }
            const newTask = JSON.parse(task);
            const tasks = JSON.parse(data);
            
            tasks.push(newTask);
            fs.writeFile(path, JSON.stringify(tasks), (error) => {
                if (error) {
                    console.log(error);
                    response.statusCode = 500;
                    response.end();
                    return;
                }
            });
            response.statusCode = 200;
            response.end(JSON.stringify(newTask));
        });
    });
}

//Read
function handleGetTasksById(request, response) {
    const chunks = [];
    request.on('data', chunk => {
        chunks.push(chunk);
    });
    request.on('end', () => {
        const userId = JSON.parse(Buffer.concat(chunks).toString()).userId;
        fs.readFile(path, "utf8", (error, data) => {
            if (error) {
                console.log(error);
                response.statusCode = 500;
                response.end();
                return;
            }
            const tasks = JSON.parse(data);

            const userTasks = tasks.filter(t => t.owner === userId);
            response.statusCode = 200;
            response.end(JSON.stringify(userTasks));
        });
    });
}


//Update
function handleUpdateTask(request, response) {
    const chunks = [];
    request.on('data', chunk => {
        chunks.push(chunk);
    });
    request.on('end', () => {
        const task = Buffer.concat(chunks).toString();
        fs.readFile(path, "utf8", (error, data) => {
            if (error) {
                console.log(error);
                response.statusCode = 500;
                response.end();
                return;
            }
            const updatedTask = JSON.parse(task);
            const tasks = JSON.parse(data);
            
            const index = tasks.findIndex(t => t.id === updatedTask.id);

            for (const key in updatedTask) {
                tasks[index][key] = updatedTask[key];
            }

            fs.writeFile(path, JSON.stringify(tasks), (error) => {
                if (error) {
                    console.log(error);
                    response.statusCode = 500;
                    response.end();
                    return;
                }
            });
            response.statusCode = 200;
            response.end(JSON.stringify(updatedTask));
        });
    });
}

//Delete
function handleDeleteTaskById(request, response) {
    const chunks = [];
    request.on('data', chunk => {
        chunks.push(chunk);
    });
    request.on('end', () => {
        const taskId = JSON.parse(Buffer.concat(chunks).toString()).taskId;
        fs.readFile(path, "utf8", (error, data) => {
            if (error) {
                console.log(error);
                response.statusCode = 500;
                response.end();
                return;
            }
            const tasks = JSON.parse(data);

            const index = tasks.findIndex(t => t.id === taskId);
            tasks.splice(index, 1);

            fs.writeFile(path, JSON.stringify(tasks), (error) => {
                if (error) {
                    console.log(error);
                    response.statusCode = 500;
                    response.end();
                    return;
                }
            });
            response.statusCode = 200;
            response.end(`Task with id ${taskId} was deleted`);
        });
    });
}

module.exports = {
    handleAddTask,
    handleUpdateTask,
    handleGetTasksById,
    handleDeleteTaskById
};