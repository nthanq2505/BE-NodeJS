const fs = require('fs');
const { user } = require('../../router/routes');

const path = "./database/tasks.json";
const userPath = "./database/user.json";

function authenticateUser (token) {
    return new Promise((resolve, reject) => {
        fs.readFile(userPath, "utf8", (error, data) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            const users = JSON.parse(data);
            const user = users.find(u => u.token === token);
            if (user) {
                resolve(user.username);
            }
            reject("");
        });
    }).catch((error) => {
        console.log(error);
    })
}

//Create
function handleAddTask(request, response) {
    const chunks = [];
    request.on('data', chunk => {
        chunks.push(chunk);
    });
    request.on('end', async () => {
        const task = Buffer.concat(chunks).toString();
        const bearerToken = request.headers.authorization.split(" ")[1];
        const newTask = JSON.parse(task);
        fs.readFile(userPath, "utf8", (error, data) => {
            if (error) {
                console.log(error);
                response.statusCode = 500;
                response.end();
                return;
            }
            const users = JSON.parse(data);
            const user = users.find(u => u.username === bearerToken.split(".")[0] && u.password === bearerToken.split(".")[1]);
            if (!user) {
                response.statusCode = 401;
                response.end("Unauthorized");
                return;
            } else {
                fs.readFile(path, "utf8", (error, data) => {
                    if (error) {
                        console.log(error);
                        response.statusCode = 500;
                        response.end();
                        return;
                    }
                    const tasks = JSON.parse(data);
                    delete newTask.token;
        
                    newTask.owner = user.username;
                    newTask.id = tasks.length + 1;
                    
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
            }
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
        const bearerToken = request.headers.authorization.split(" ")[1];
        // console.log(bearerToken.split(".")[0]);
        fs.readFile(userPath, "utf8", (error, data) => {
            if (error) {
                console.log(error);
                response.statusCode = 500;
                response.end();
                return;
            }
            const users = JSON.parse(data);
            console.log(users);
            const user = users.find(u => u.username === bearerToken.split(".")[0] && u.password === bearerToken.split(".")[1]);
            console.log(user);
            if (!user) {
                response.statusCode = 401;
                response.end("Unauthorized");
                return;
            }else{
                fs.readFile(path, "utf8", (error, data) => {
                    if (error) {
                        console.log(error);
                        response.statusCode = 500;
                        response.end();
                        return;
                    }
                    const tasks = JSON.parse(data);
        
                    const userTasks = tasks.filter(t => t.owner === user.username);
                    response.statusCode = 200;
                    response.end(JSON.stringify(userTasks));
                });
            }
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