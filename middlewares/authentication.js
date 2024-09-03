const { decodeToken, getCollection } = require("../helpers");
const {
  httpStatusCodes,
  secretKey,
  collectionNames,
} = require("../utils/constants");

const usersCollection = getCollection(collectionNames.USER);

function authentication(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const bearerToken =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
      if (!bearerToken) {
        res.statusCode = httpStatusCodes.UNAUTHORIZED;
        res.end("Unauthorized: No token provided");
        reject("Unauthorized: No token provided");
        return;
      }

      const [username, secretKeyFromToken] =
        decodeToken(bearerToken).split(":");
      if (secretKeyFromToken !== secretKey) {
        res.statusCode = httpStatusCodes.UNAUTHORIZED;
        res.end("Unauthorized: Invalid token");
        reject("Unauthorized: Invalid token");
        return;
      }

      const user = await usersCollection.findOne({ username });
      if (!user) {
        res.statusCode = httpStatusCodes.UNAUTHORIZED;
        res.end("Unauthorized: Invalid user");
        reject("Unauthorized: Invalid user");
        return;
      }

      req.user = user;
      resolve();
    } catch (error) {
      console.error("Error in authentication middleware:", error);
      res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
      res.end("Internal Server Error");
      reject("Internal Server Error");
    }
  });
}

module.exports = authentication;
