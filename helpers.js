const { MongoClient } = require("mongodb");
const { uriMongo, databaseName, secretKey } = require("./utils/constants");

function encodeToken(data) {
  return Buffer.from(`${data}:${secretKey}`).toString("base64");
}

function decodeToken(token) {
  return Buffer.from(token, "base64").toString();
}

function getCollection(collectionName) {
  const client = new MongoClient(uriMongo);
  const database = client.db(databaseName);
  return database.collection(collectionName);
}

module.exports = {
  encodeToken,
  decodeToken,
  // getDataFromRequest,
  // authorizeUserFromRequest,
  getCollection,
};
