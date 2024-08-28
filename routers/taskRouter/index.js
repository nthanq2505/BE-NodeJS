const routerMethods = require("../methods.js");
const routes = require("../routes.js");

const taskController = require("../../controllers/index.js");

const userRouter = {
  run(req, res) {
    routerMethods.get(
      req,
      res,
      routes.task.getTasks.value,
      taskController.handleGetTasksByUser
    );
    routerMethods.post(
      req,
      res,
      routes.task.addTask.value,
      taskController.handleAddTask
    );
    routerMethods.put(
      req,
      res,
      routes.task.updateTask.value,
      taskController.handleUpdateTask
    );
    routerMethods.delete(
      req,
      res,
      routes.task.deleteTask.value,
      taskController.handleDeleteTaskById
    );
  },
};

module.exports = userRouter;
