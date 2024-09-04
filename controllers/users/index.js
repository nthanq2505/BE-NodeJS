const { encodeToken, getCollection } = require("../../helpers");
const {
  httpStatusCodes,
  collectionNames,
  // CAN USE IN FUTURE
  // apiRoot,
  // httpMethods,
  // databaseName,
  // uriMongo,
} = require("../../utils/constants");

const usersCollection = getCollection(collectionNames.USER);

async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.statusCode = httpStatusCodes.BAD_REQUEST;
      res.end("400 Bad Request");
      return;
    }

    const user = await usersCollection.findOne({
      username: username,
      password: password,
    });
    if (!user) {
      res.statusCode = httpStatusCodes.NOT_FOUND;
      res.end("404 Not Found");
      return;
    }

    res.statusCode = httpStatusCodes.OK;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        username: user.username,
        token: user.token,
      })
    );
  } catch (error) {
    console.error("Login failed:", error);
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    res.end("500 Internal Server Error");
  }
}

async function handleRegister(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.statusCode = httpStatusCodes.BAD_REQUEST;
      res.end("400 Bad Request");
      return;
    }

    //check exist user
    const user = await usersCollection.findOne({ username: username});
    if (user) {
      res.statusCode = httpStatusCodes.CONFLICT;
      res.end("Username already exist");
      return;
    }

    const result = await usersCollection.insertOne({
      username: username,
      password: password,
      token: encodeToken(reqData.username),
    });

    if (result.insertedId) {
      res.statusCode = httpStatusCodes.CREATED;
      res.end();
      return;
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    res.end("500 Internal Server Error");
  }
}

module.exports = {
  handleLogin,
  handleRegister,
};
