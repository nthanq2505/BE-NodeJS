const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const Task = require("../models/task");
const authentication = require("../middlewares/authentication");

// get all task by id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.find({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }
    const tasks = await Task.find({ project: req.params.id });
    project.tasks = tasks;
    res.status(200).send(project);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// get all task by user
router.get("/", authentication.isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ user: userId });
    let data = [];
    for (let i = 0; i < projects.length; i++) {
      const tasks = await Task.find({ project: projects[i]._id });
      data.push({ project: projects[i], tasks: tasks });
    }

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// create a new project
router.post("/", authentication.isAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      res.status(400).send({ message: "Bad Request" });
    }

    const newProject = new Project({
      title: title,
      description: description,
      user: req.user._id,
    });

    await newProject.save();
    res.status(201).send({ message: "Project created" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// update a project
router.patch("/:id", authentication.isAuth, async (req, res) => {
  try {
    //find the project by id and user
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }
    // only update the project with name or description
    const { title, description } = req.body;
    if (title) {
      project.title = title;
    } else if (description) {
      project.description = description;
    }
    await project.save();
    res.status(200).send({ message: "Project updated" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// delete a project
router.delete("/:id", authentication.isAuth, async (req, res) => {
  try {
    //find the project by id and user
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }
    await project.remove();
    // TODO: delete all tasks related to the project
    // await Task.deleteMany({ project: req.params.id });
    res.status(200).send({ message: "Project deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
