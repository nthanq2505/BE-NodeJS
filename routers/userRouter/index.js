const routerMethods = require("../methods.js");
const routes = require("../routes.js");

const userController = require("../../controllers/index.js");

const userRouter = {
  run(request, response) {
    routerMethods.post(request, response, routes.user.login.value, userController.handleLogin);
    routerMethods.post(request, response, routes.user.register.value, userController.handleRegister);
  },
};

module.exports = userRouter;