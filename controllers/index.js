const { httpStatusCodes } = require("../helpers");
const taskControllers = require("./tasks");
const userControllers = require("./users");

function handleNotFound(req, res) {
  res.statusCode = httpStatusCodes.NOT_FOUND;
  res.end("Not Found");
}

module.exports = {
  handleNotFound,
  ...taskControllers,
  ...userControllers,
};
