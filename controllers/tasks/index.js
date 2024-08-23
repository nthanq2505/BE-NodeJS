const fs = require("fs");
const { user } = require("../../router/routes");
const {httpStatusCodes, secretKey, encodeToken, decodeToken} = require("../helper");

//Create
function handleAddTask(request, response) {
  const chunks = [];
  request.on("data", (chunk) => {
    chunks.push(chunk);
  });
  request.on("end", async () => {
    const task = JSON.parse(Buffer.concat(chunks).toString());
    const bearerToken =
      request.headers.authorization &&
      request.headers.authorization.split(" ")[1];
    if (!bearerToken) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const user = await fetch("http://localhost:8080/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "user",
        filter: {
          username: bearerToken.split(".")[0],
          password: bearerToken.split(".")[1],
        },
      }),
    });
    if (!user) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const newTask = {
      ...task,
      owner: user.username,
    };
    const res = await fetch("http://localhost:8080/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "task",
        record: newTask,
      }),
    });
    if (res.status !== 201) {
      response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
      response.end();
      return;
    } else {
      response.statusCode = httpStatusCodes.CREATED;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(newTask));
    }
  });
}

//Read
function handleGetTasksByUser(request, response) {
  const chunks = [];
  request.on("data", (chunk) => {
    chunks.push(chunk);
  });
  request.on("end", async () => {
    const bearerToken =
      request.headers.authorization &&
      request.headers.authorization.split(" ")[1];
    if (!bearerToken) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const [ idUser, secret ] = decodeToken(bearerToken).split(":");
    if (secret !== secretKey) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const user = await fetch("http://localhost:8080/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "user",
        filter: {
            id: String(idUser),
        },
      }),
    }).then((res) => res.json());
    if (!user) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const tasks = await fetch("http://localhost:8080/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "task",
        filter: {
          owner: user.id,
        },
      }),
    }).then((res) => res.json());
    if (tasks.length === 0) {
      response.statusCode = httpStatusCodes.NOT_FOUND;
      response.end("Not Found");
      return;
    }
    response.statusCode = httpStatusCodes.OK;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(tasks));
  });
}

//Update
function handleUpdateTask(request, response) {
  const chunks = [];
  request.on("data", (chunk) => {
    chunks.push(chunk);
  });
  request.on("end", async () => {
    const task = Buffer.concat(chunks).toString();
    const updatedTask = JSON.parse(task);
    const bearerToken =
      request.headers.authorization &&
      request.headers.authorization.split(" ")[1];
    if (!bearerToken) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }

    const user = await fetch("http://localhost:8080/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "user",
        filter: {
          username: bearerToken.split(".")[0],
          password: bearerToken.split(".")[1],
        },
      }),
    });
    if (!user) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const tasks = await fetch("http://localhost:8080/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "task",
        filter: {
          owner: user.username,
        },
      }),
    });
    if (tasks.length === 0) {
      response.statusCode = httpStatusCodes.NOT_FOUND;
      response.end("Not Found");
      return;
    }
    console.log(updatedTask);
    const res = await fetch("http://localhost:8080/api/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "task",
        filter: {
          id: updatedTask.id,
        },
        update: updatedTask,
      }),
    });
    if (res.status !== 200) {
      response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
      response.end();
      return;
    }
    response.statusCode = httpStatusCodes.OK;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(updatedTask));
  });
}

//Delete
function handleDeleteTaskById(request, response) {
  const chunks = [];
  request.on("data", (chunk) => {
    chunks.push(chunk);
  });
  request.on("end", async () => {
    const taskId = JSON.parse(Buffer.concat(chunks).toString()).taskId;
    const bearerToken =
      request.headers.authorization &&
      request.headers.authorization.split(" ")[1];
    if (!bearerToken) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const user = await fetch("http://localhost:8080/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "user",
        filter: {
          username: bearerToken.split(".")[0],
          password: bearerToken.split(".")[1],
        },
      }),
    });
    if (!user) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const tasks = await fetch("http://localhost:8080/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "task",
        filter: {
          owner: user.username,
        },
      }),
    });
    if (tasks.length === 0) {
      response.statusCode = httpStatusCodes.NOT_FOUND;
      response.end("Not Found");
      return;
    }
    const res = await fetch("http://localhost:8080/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: "task",
        filter: {
          id: taskId,
        },
      }),
    });
    if (res.status !== 200) {
      response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
      response.end();
      return;
    }
    response.statusCode = httpStatusCodes.OK;
    response.end();
  });
}

module.exports = {
  handleAddTask,
  handleUpdateTask,
  handleGetTasksByUser,
  handleDeleteTaskById,
};
