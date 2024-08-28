const { httpMethods } = require("../utils/constants");

const routerMethods = {
  get: function (req, res, path, callback) {
    if (path === req.url && req.method === httpMethods.GET) {
      callback(req, res);
    }
  },
  post: function (req, res, path, callback) {
    if (path === req.url && req.method === httpMethods.POST) {
      callback(req, res);
    }
  },
  put: function (req, res, path, callback) {
    if (path === req.url && req.method === httpMethods.PUT) {
      callback(req, res);
    }
  },
  delete: function (req, res, path, callback) {
    if (path === req.url && req.method === httpMethods.DELETE) {
      callback(req, res);
    }
  },
};

module.exports = routerMethods;
