const { MongoClient } = require("mongodb");
const { uriMongo, databaseName } = require("../utils/constants");

const secretKey = "secretKey";

function encodeToken(data) {
  return Buffer.from(`${data}:${secretKey}`).toString("base64");
}

function decodeToken(token) {
  return Buffer.from(token, "base64").toString();
}

function generateId() {
  return Date.now().toString();
}

function getDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};

function authorizeUserFromRequest(req) {
  const bearerToken = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!bearerToken) {
    return null;
  }
  const [username, secretKeyFromToken] = decodeToken(bearerToken).split(":");
  if (secretKeyFromToken !== secretKey) {
    return null;
  }
  return username;
}


function getCollection(collectionName) {
  const client = new MongoClient(uriMongo);
  const database = client.db(databaseName);
  return database.collection(collectionName);
}

module.exports = {
  secretKey,
  encodeToken,
  decodeToken,
  generateId,
  getDataFromRequest,
  authorizeUserFromRequest,
  getCollection
};
