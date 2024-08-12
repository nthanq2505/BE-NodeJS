const fs = require('fs').promises;

const path = "./database/tasks.json";

function writeFile(data) {
    fs.writeFile(path, JSON.stringify(data));
}

function readFile() {
    return fs.readFile(path).then(data => JSON.parse(data) || []).catch(() => []);
}

function addTask(request, response) {
    const chunks = [];
    request.on('data', chunk => {
        chunks.push(chunk);
    });
    request.on('end', async () => {
        const data = Buffer.concat(chunks).toString();
        const tasks = await readFile();
        const newTask = JSON.parse(data);
        console.log(tasks);
        tasks.push(newTask);
        await writeFile(tasks);
        response.statusCode = 200;
        response.end(JSON.stringify(newTask));
    });
}

module.exports = {
    addTask
};