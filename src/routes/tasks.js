const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const authentication = require("../middlewares/authentication");


// get all task
router.get("/", authentication.isAuth, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// create a new task
router.post('/',authentication.isAuth, async (req, res) => {
  try {
    const { name, project } = req.body;
    if (!name || !project) {
      res.status(400).send({ message: "Bad Request" });
    }

    const newTask = new Task({
      name: name,
      project: project,
    });

    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// update task by id
router.patch('/:id', authentication.isAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    const { name, isCompleted } = req.body;
    if (name) {
      task.name = name;
    } else if (isCompleted !== undefined) {
      task.isCompleted = isCompleted;
    }
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete('/:id', authentication.isAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.status(200).send({ message: "Task deleted" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
