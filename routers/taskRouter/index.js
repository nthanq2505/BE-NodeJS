const routerMethods = require("../methods.js");
const routes = require("../routes.js");
const { getDataFromBody, authentication } = require("../../middlewares/index.js");

const taskController = require("../../controllers/index.js");

const userRouter = {
  run(req, res) {
    routerMethods.get(
      req,
      res,
      routes.task.getTasks.value,
      [authentication],
      taskController.handleGetTasksByUser
    );
    routerMethods.post(
      req,
      res,
      routes.task.addTask.value,
      [authentication, getDataFromBody],
      taskController.handleAddTask
    );
    routerMethods.put(
      req,
      res,
      routes.task.updateTask.value,
      [authentication, getDataFromBody],
      taskController.handleUpdateTask
    );
    routerMethods.delete(
      req,
      res,
      routes.task.deleteTask.value,
      [authentication],
      taskController.handleDeleteTaskById
    );
  },
};

module.exports = userRouter;
