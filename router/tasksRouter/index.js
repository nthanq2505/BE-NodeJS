const routerMethods = require("../methods.js");
const routes = require("../routes.js");

const userController = require("../../controllers/index.js");

const userRouter = {
  run(req, res) {
    routerMethods.get(req, res, routes.getTasks.value, userController.handleGetTasksById);
    routerMethods.post(req, res, routes.addTask.value, userController.handleAddTask);
    routerMethods.put(req, res, routes.updateTask.value, userController.handleUpdateTask);
    routerMethods.delete(req, res, routes.deleteTask.value, userController.handleDeleteTaskById);
  },
};

module.exports = userRouter;