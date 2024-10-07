const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const {
  handleGetProjectsById,
  handleGetAllProjectByUser,
  handleCreateProject,
  handleUpdateProject,
  handleDeleteProject,
} = require("../controllers/projectController");

// get all task by id
router.get("/:id", authentication.isAuth, handleGetProjectsById);

// get all task by user
router.get("/", authentication.isAuth, handleGetAllProjectByUser);

// create a new project
router.post("/", authentication.isAuth, handleCreateProject);

// update a project
router.patch("/:id", authentication.isAuth, handleUpdateProject);

// delete a project
router.delete("/:id", authentication.isAuth, handleDeleteProject);

module.exports = router;
