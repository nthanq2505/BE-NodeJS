const { httpMethods } = require("../utils/constants");

function runMiddlewares(req, res, middlewares, callback) {
  let promise = middlewares[0](req, res);
  for (let i = 1; i < middlewares.length; i++) {
    promise = promise.then(() => middlewares[i](req, res));
  }
  promise.finally(() => {
    callback(req, res);
  });
  return promise;
}

const routerMethods = {
  get: function (req, res, path, middlewares, callback) {
    if (path === req.url && req.method === httpMethods.GET) {
      runMiddlewares(req, res, middlewares, callback);
    }
  },
  post: function (req, res, path, middlewares, callback) {
    if (path === req.url && req.method === httpMethods.POST) {
      runMiddlewares(req, res, middlewares, callback);
      
    }
  },
  put: function (req, res, path, middlewares, callback) {
    if (path === req.url && req.method === httpMethods.PUT) {
      runMiddlewares(req, res, middlewares, callback);
    }
  },
  delete: function (req, res, path, middlewares, callback) {
    if (path === req.url && req.method === httpMethods.DELETE) {
      runMiddlewares(req, res, middlewares, callback);
    }
  },
};

module.exports = routerMethods;
