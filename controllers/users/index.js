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
    const reqData = req.body;
    console.log("reqData", reqData);

    const user = await usersCollection.findOne(reqData);
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
    const reqData = req.body;

    //check exist user
    const user = await usersCollection.findOne({ username: reqData.username });

    if (user) {
      res.statusCode = httpStatusCodes.CONFLICT;
      res.end("Username already exist");
      return;
    }

    const token = encodeToken(reqData.username);
    const newUser = {
      ...reqData,
      token: token,
    };

    const result = await usersCollection.insertOne(newUser);
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
