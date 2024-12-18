const routerMethods = require("../methods.js");
const routes = require("../routes.js");
const {getDataFromBody} = require("../../middlewares/index.js");

const userController = require("../../controllers/index.js");

const userRouter = {
  run(req, res) {
    routerMethods.post(
      req,
      res,
      routes.user.login.value,
      [getDataFromBody],
      userController.handleLogin
    );
    routerMethods.post(
      req,
      res,
      routes.user.register.value,
      [getDataFromBody],
      userController.handleRegister
    );
    routerMethods.get(
      req,
      res,
      routes.user.ping.value,
      [],
      userController.handlePing
    );
  },
};

module.exports = userRouter;
