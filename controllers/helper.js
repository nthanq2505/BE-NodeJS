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

const getDataFromRequest = (req) => {
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

module.exports = {
  secretKey,
  encodeToken,
  decodeToken,
  generateId,
  getDataFromRequest
};
