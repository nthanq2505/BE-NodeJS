const {
  httpStatusCodes,
  collectionNames,
} = require("../../utils/constants");
const { 
  getCollection 
} = require("../../helpers");

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
    // const bearerToken =
    //   req.headers.authorization && req.headers.authorization.split(" ")[1];

    // if (!bearerToken) {
    //   res.statusCode = httpStatusCodes.UNAUTHORIZED;
    //   res.end("Unauthorized");
    //   return;
    // }

    // const secretKeyFromToken = decodeToken(bearerToken).split(":")[1];
    // if (secretKeyFromToken !== secretKey) {
    //   res.statusCode = httpStatusCodes.UNAUTHORIZED;
    //   res.end("Unauthorized: Invalid token");
    //   return;
    // }

    // const updateTask = await getDataFromRequest(req);

    // const updateResponse = await fetch(`${apiRoot}/api/update`, {
    //   method: httpMethods.PUT,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     collection: collectionNames.TASK,
    //     filter: { id: updateTask.id },
    //     update: updateTask,
    //   }),
    // });

    // if (updateResponse.status !== httpStatusCodes.NO_CONTENT) {
    //   res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    //   res.end("Internal Server Error");
    //   return;
    // }

    res.statusCode = httpStatusCodes.NO_CONTENT;
    res.end();
  } catch (error) {
    console.error("Error handling update task:", error);
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    res.end("Internal Server Error");
  }
}

async function handleDeleteTaskById(req, res) {
  // const body = await getDataFromRequest(req);
  // taskId = body.id;

  // const bearerToken =
  //   req.headers.authorization && req.headers.authorization.split(" ")[1];
  // if (!bearerToken) {
  //   res.statusCode = httpStatusCodes.UNAUTHORIZED;
  //   res.end("Unauthorized");
  //   return;
  // }

  // if (!taskId) {
  //   res.statusCode = httpStatusCodes.NOT_FOUND;
  //   res.end("Invalid task id");
  //   return;
  // }

  // const secretKeyFromToken = decodeToken(bearerToken).split(":")[1];
  // if (secretKeyFromToken !== secretKey) {
  //   res.statusCode = httpStatusCodes.UNAUTHORIZED;
  //   res.end("Unauthorized: Invalid token");
  //   return;
  // }

  // const taskResponse = await fetch(`${apiRoot}/api/read`, {
  //   method: httpMethods.POST,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     collection: "task",
  //     filter: {
  //       id: taskId,
  //     },
  //   }),
  // });

  // const task = await taskResponse.json();

  // if (task.length === 0) {
  //   res.statusCode = httpStatusCodes.NOT_FOUND;
  //   res.end();
  //   return;
  // }

  // const res = await fetch(`${apiRoot}/api/delete`, {
  //   method: httpMethods.DELETE,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     collection: "task",
  //     filter: {
  //       id: taskId,
  //     },
  //   }),
  // });
  // if (res.status !== httpStatusCodes.NO_CONTENT) {
  //   res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
  //   res.end();
  //   return;
  // }
  res.statusCode = httpStatusCodes.NO_CONTENT;
  res.end();
}

module.exports = {
  handleAddTask,
  handleUpdateTask,
  handleGetTasksByUser,
  handleDeleteTaskById,
};
