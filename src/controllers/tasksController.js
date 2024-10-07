const Task = require("../models/task");

const handleGetAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const handleCreateTask = async (req, res) => {
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
};

const handleUpdateTask = async (req, res) => {
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
};

const handleDeleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.status(200).send({ message: "Task deleted" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
    handleGetAllTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
};