const routerMethods = require("../methods.js");
const routes = require("../routes.js");

const taskController = require("../../controllers/index.js");

const userRouter = {
  run(request, response) {
    routerMethods.get(request, response, routes.task.getTasks.value, taskController.handleGetTasksByUser);
    routerMethods.post(request, response, routes.task.addTask.value, taskController.handleAddTask);
    routerMethods.put(request, response, routes.task.updateTask.value, taskController.handleUpdateTask);
    routerMethods.delete(request, response, routes.task.deleteTask.value, taskController.handleDeleteTaskById);
  },
};

module.exports = userRouter;