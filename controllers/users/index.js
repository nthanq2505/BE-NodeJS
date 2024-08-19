const fs = require('fs')
const httpStatusCodes = require('../httpStatusCodes');

const usersData = require("../../database/users.json");

//Read
function handleLogin(request, response) {
    const chunks = [];
    request.on('data', chunk => {
        chunks.push(chunk);
    });
    request.on('end', () => {
        const reqData = JSON.parse(Buffer.concat(chunks).toString());
        const user = usersData.find(u => u.username === reqData.username && u.password === reqData.password);
        if (!user) {
            response.statusCode = httpStatusCodes.UNAUTHORIZED;
            response.end("Unauthorized");
            return;
        }
        const token = `${user.username}.${user.password}`;
        user.token = token;
        fs.writeFile("./database/users.json", JSON.stringify(usersData), (error) => {
            if (error) {
                console.log(error);
                response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
                response.end();
                return;
            }
            response.statusCode = httpStatusCodes.OK;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(token));
        });
    });
}

module.exports = {
    handleLogin
};