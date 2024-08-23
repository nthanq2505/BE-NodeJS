const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const secretKey = "secretKey";

function encodeToken(data) {
  return Buffer.from(`${data}:${secretKey}`).toString("base64");
}

function decodeToken(token) {
  return Buffer.from(token, "base64").toString();
}

module.exports = {
  httpStatusCodes,
  secretKey,
  encodeToken,
  decodeToken,
};
