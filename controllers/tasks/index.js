const {
  httpStatusCodes,
  collectionNames,
} = require("../../utils/constants");
const { 
  getCollection 
} = require("../../helpers");
const { ObjectId } = require("mongodb");

const tasksCollection = getCollection(collectionNames.TASK);

async function handleAddTask(req, res) {
  try {
    const { task } = req.body;
    const user = req.user;

    if (!task) {
      res.statusCode = httpStatusCodes.BAD_REQUEST;
      res.end("400 Bad Request");
      return;
    }

    if (!task.name || !task.isDone) {
      res.statusCode = httpStatusCodes.BAD_REQUEST;
      res.end("400 Bad Request");
      return;
    }

    const result = await tasksCollection.insertOne({
      ...task,
      ownerId: user._id,
    });

    res.statusCode = httpStatusCodes.CREATED;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error("Error handling task creation:", error);
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    res.end("Internal Server Error");
  }
}

async function handleGetTasksByUser(req, res) {
  try {
    const user = req.user;
    const tasks = await tasksCollection.find({ 
      ownerId: user._id 
    }).toArray();

    res.statusCode = httpStatusCodes.OK;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(tasks));
  } catch (error) {
    console.error("Error handling get tasks by user:", error);
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    res.end("Internal Server Error");
  }
}

async function handleUpdateTask(req, res) {
  try {
    const user = req.user
    const body = req.body
    console.log(user)
    console.log(body)
    if (!body.task) {
      res.statusCode = httpStatusCodes.BAD_REQUEST;
      res.end("400 Bad Request");
      return;
    }

    if (!body.task.id) {
      if (!body.task.name && !body.task.isDone) {
        res.statusCode = httpStatusCodes.BAD_REQUEST;
        res.end("400 Bad Request");
        return;
      }
    }

    const result = await tasksCollection.updateOne(
      { 
        _id: new ObjectId(body.task.id),
        ownerId: user._id 
      },
      { 
        $set: { 
          ...body.task
        }
      }
    );

    if (result.modifiedCount === 0) {
      res.statusCode = httpStatusCodes.NOT_FOUND;
      res.end();
      return;
    }
    res.statusCode = httpStatusCodes.NO_CONTENT;
    res.end();
    return;
  } catch (error) {
    console.error("Error handling update task:", error);
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    res.end("Internal Server Error");
  }
}

async function handleDeleteTaskById(req, res) {
  try {
    const user = req.user;
    const taskId = req.body.id;

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(taskId),
      ownerId: user._id,
    });

    if (result.deletedCount === 0) {
      res.statusCode = httpStatusCodes.NOT_FOUND;
      res.end();
      return;
    }

    res.statusCode = httpStatusCodes.NO_CONTENT;
    res.end();
  } catch (error) {
    console.error("Error handling delete task by id:", error);
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    res.end("Internal Server Error");
  }
}

module.exports = {
  handleAddTask,
  handleUpdateTask,
  handleGetTasksByUser,
  handleDeleteTaskById,
};
