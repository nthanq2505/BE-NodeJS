const fs = require('fs')
const httpStatusCodes = require('../httpStatusCodes');

const secretKey = 'secretKey';

function encodeToken(data) {
    return Buffer.from(`${data}:${secretKey}`).toString('base64');
}

function decodeToken(token) {
    return Buffer.from(token, 'base64').toString();
}

function handleLogin(req, res) {
    const chunks = [];
    req.on('data', chunk => {
        chunks.push(chunk);
    });
    req.on('end', async () => {
        const reqData = JSON.parse(Buffer.concat(chunks).toString());
        
        const userRes = await fetch('http://localhost:8080/api/read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "collection": "user",
                "filter": {
                    "username": reqData.username,
                    "password": reqData.password
                }
            })
        });
        const user = await userRes.json();
        console.log(user);
        if (user.length === 0) {
            res.statusCode = httpStatusCodes.NOT_FOUND;
            res.end();
            return;
        }
        
        const token = encodeToken(user[0].id);
        console.log(decodeToken(token));

        const databaseRes = await fetch('http://localhost:8080/api/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "collection": "user",
                "filter": {
                    "username": reqData.username,
                    "password": reqData.password
                },
                "update": user[0]
            })
        });
        if (databaseRes.status !== 200) {
            res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
            res.end();
            return;
        } else {
            res.statusCode = httpStatusCodes.OK;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                "username": user[0].username,
                "token": token
            }));
        }
    });
}

function handleRegister(req, res) {
    const chunks = [];
    req.on('data', chunk => {
        chunks.push(chunk);
    });
    req.on('end', async () => {
        const reqData = JSON.parse(Buffer.concat(chunks).toString());
        
        const userRes = await fetch('http://localhost:8080/api/read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "collection": "user",
                "filter": {
                    "username": reqData.username
                }
            })
        });
        const user = await userRes.json();
        if (user.length > 0) {
            res.statusCode = httpStatusCodes.CONFLICT;
            res.end();
            return;
        }
        
        const databaseRes = await fetch('http://localhost:8080/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "collection": "user",
                "record": reqData
            })
        });
        if (databaseRes.status !== httpStatusCodes.CREATED) {
            res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
            res.end();
            return;
        } else {
            res.statusCode = httpStatusCodes.CREATED;
            res.end();
        }
    });
}


module.exports = {
    handleLogin,
    handleRegister
};