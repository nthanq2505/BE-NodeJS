require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./db");
const userRouter = require("./routes/users.js");
const projectRouter = require("./routes/projects.js");
const taskRouter = require("./routes/tasks.js");

const hostname = '127.0.0.1'
const port = 3000;

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
}
app.use(loggingMiddleware);

// Connection to the database
connection();

// middleware
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});