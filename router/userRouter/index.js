const routerMethods = require("../methods.js");
const routes = require("../routes.js");

const userController = require("../../controllers/index.js");

const userRouter = {
  run(req, res) {
    routerMethods.post(req, res, routes.user.login.value, userController.handleLogin);
  },
};

module.exports = userRouter;