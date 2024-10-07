const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const {
  handleGetAllTasks,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} = require("../controllers/tasksController");

// get all task
router.get("/", authentication.isAuth, handleGetAllTasks);
// create a new task
router.post("/", authentication.isAuth, handleCreateTask);
// update task by id
router.patch("/:id", authentication.isAuth, handleUpdateTask);
// delete task by id
router.delete("/:id", authentication.isAuth, handleDeleteTask);

module.exports = router;
